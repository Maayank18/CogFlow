"""
CogFlow Model Training & Evaluation Pipeline
===========================================
Trains the CogFlowSequenceModel (BiLSTM + Attention) on the DAiSEE benchmark dataset.
Outputs:
  - exported_models/cogflow_daisee.pth  (PyTorch weights)
  - exported_models/cogflow_daisee.onnx (ONNX export for browser / edge deployment)
  - Full evaluation metrics & confusion matrix on held-out Test set.
"""

import os
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from sklearn.metrics import classification_report, confusion_matrix, f1_score

from model import CogFlowSequenceModel

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'daisee', 'daisee_cogflow_processed.npz')
EXPORT_DIR = os.path.join(BASE_DIR, 'exported_models')
os.makedirs(EXPORT_DIR, exist_ok=True)

CLASS_NAMES = ['Flow (0)', 'Overload/Confusion (1)', 'Boredom (2)']

def balance_classes(X, y):
    """
    Apply balanced resampling to ensure the model gives equal importance
    to Overload/Confusion and Boredom during gradient updates.
    """
    classes, counts = np.unique(y, return_counts=True)
    max_count = max(counts)
    
    balanced_indices = []
    for c in classes:
        idx_c = np.where(y == c)[0]
        resampled_c = np.random.choice(idx_c, size=max_count, replace=True)
        balanced_indices.append(resampled_c)
        
    all_indices = np.concatenate(balanced_indices)
    np.random.shuffle(all_indices)
    return X[all_indices], y[all_indices]

def train():
    print("=" * 65)
    print(" CogFlow AI Brain - Model Training on DAiSEE")
    print("=" * 65)
    
    # 1. Load Data
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Processed dataset not found at {DATA_PATH}. Run prepare_daisee.py first!")

    data = np.load(DATA_PATH)
    X_train, y_train = data['X_train'], data['y_train']
    X_val, y_val = data['X_val'], data['y_val']
    X_test, y_test = data['X_test'], data['y_test']

    print(f"Dataset Loaded:")
    print(f"  Train: {X_train.shape[0]} samples | Val: {X_val.shape[0]} samples | Test: {X_test.shape[0]} samples")

    # 2. Resample Training Data for Class Balance
    X_tr_bal, y_tr_bal = balance_classes(X_train, y_train)
    print(f"Balanced Training Set: {X_tr_bal.shape[0]} samples ({np.bincount(y_tr_bal)} per class)")

    # 3. Create PyTorch Tensors & Loaders
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using Compute Device: {device}")

    train_tensor_x = torch.tensor(X_tr_bal, dtype=torch.float32)
    train_tensor_y = torch.tensor(y_tr_bal, dtype=torch.long)
    val_tensor_x = torch.tensor(X_val, dtype=torch.float32).to(device)
    val_tensor_y = torch.tensor(y_val, dtype=torch.long).to(device)
    test_tensor_x = torch.tensor(X_test, dtype=torch.float32).to(device)

    train_dataset = TensorDataset(train_tensor_x, train_tensor_y)
    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)

    # 4. Initialize Model, Loss, Optimizer
    model = CogFlowSequenceModel(input_dim=7, hidden_dim=64, num_layers=2, num_classes=3, dropout=0.3).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=0.001, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='max', factor=0.5, patience=3)

    # 5. Training Loop
    epochs = 20
    best_val_f1 = 0.0
    best_model_path = os.path.join(EXPORT_DIR, 'cogflow_daisee.pth')

    print("\nStarting Training Epochs...")
    print("-" * 65)

    for epoch in range(1, epochs + 1):
        model.train()
        train_loss = 0.0
        correct_train = 0
        total_train = 0

        for batch_x, batch_y in train_loader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            optimizer.zero_grad()
            logits = model(batch_x)
            loss = criterion(logits, batch_y)
            loss.backward()
            optimizer.step()

            train_loss += loss.item()
            preds = logits.argmax(dim=1)
            correct_train += (preds == batch_y).sum().item()
            total_train += batch_y.size(0)

        train_loss /= len(train_loader)
        train_acc = (correct_train / total_train) * 100

        # Validation Step
        model.eval()
        with torch.no_grad():
            val_logits = model(val_tensor_x)
            val_loss = criterion(val_logits, val_tensor_y).item()
            val_preds = val_logits.argmax(dim=1)
            val_acc = (val_preds == val_tensor_y).float().mean().item() * 100
            val_f1 = f1_score(y_val, val_preds.cpu().numpy(), average='macro')

        scheduler.step(val_f1)

        print(f"Epoch {epoch:02d}/{epochs:02d} | "
              f"Train Loss: {train_loss:.4f} Acc: {train_acc:.1f}% | "
              f"Val Loss: {val_loss:.4f} Acc: {val_acc:.1f}% Macro-F1: {val_f1:.3f}")

        # Save Best Model Checkpoint
        if val_f1 > best_val_f1:
            best_val_f1 = val_f1
            torch.save(model.state_dict(), best_model_path)

    print("-" * 65)
    print(f"Training Complete! Best Val Macro-F1: {best_val_f1:.3f}")

    # 6. Evaluate on Test Set
    print("\n" + "=" * 65)
    print(" EVALUATING BEST MODEL ON HELD-OUT TEST SET")
    print("=" * 65)
    model.load_state_dict(torch.load(best_model_path, weights_only=True))
    model.eval()

    with torch.no_grad():
        test_logits = model(test_tensor_x)
        test_preds = test_logits.argmax(dim=1).cpu().numpy()

    print("\nClassification Report:")
    print(classification_report(y_test, test_preds, target_names=CLASS_NAMES, digits=3))

    cm = confusion_matrix(y_test, test_preds)
    print("Confusion Matrix:")
    print(f"{'':>25} Predicted Flow   Pred Overload    Pred Boredom")
    for i, name in enumerate(CLASS_NAMES):
        print(f"Actual {name:>20}: {cm[i][0]:>10} {cm[i][1]:>15} {cm[i][2]:>15}")

    # 7. Export to ONNX
    print("\n" + "=" * 65)
    print(" EXPORTING MODEL TO ONNX FORMAT")
    print("=" * 65)
    onnx_path = os.path.join(EXPORT_DIR, 'cogflow_daisee.onnx')
    model.cpu()
    dummy_input = torch.randn(1, 11, 7) # (batch=1, seq_len=11, features=7)

    torch.onnx.export(
        model,
        (dummy_input,),
        onnx_path,
        export_params=True,
        opset_version=14,
        input_names=['facial_sequence'],
        output_names=['cognitive_state_logits'],
        dynamic_axes={'facial_sequence': {0: 'batch_size'}, 'cognitive_state_logits': {0: 'batch_size'}},
        dynamo=False
    )
    print(f"Success! Model exported to:\n  -> {onnx_path}")
    print(f"  -> File Size: {os.path.getsize(onnx_path) / 1024:.1f} KB")

if __name__ == '__main__':
    train()