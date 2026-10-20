"""
CogFlow DAiSEE Dataset Preprocessing Pipeline
=============================================
This script processes the benchmark DAiSEE dataset into CogFlow's 3-state cognitive framework:
  - State 0: Flow (High Engagement, low confusion/boredom)
  - State 1: Overload / Confusion (High Confusion or Frustration)
  - State 2: Boredom / Disengaged (High Boredom or Low Engagement)

Outputs:
  - daisee_cogflow_processed.npz (clean sequential tensors for BiLSTM/CNN)
  - daisee_summary_features.csv (aggregated window statistics for tabular inspection)
"""

import os
import numpy as np
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'daisee')
EMOTION_NAMES = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

def map_labels(y_arr):
    """
    Map DAiSEE 4-dimensional labels [Boredom, Engagement, Confusion, Frustration] (each 0-3)
    to CogFlow's 3 cognitive states:
      0: Flow (Target state, optimal learning)
      1: Overload / Confusion (Difficulty processing, needs simplification)
      2: Boredom / Disengaged (Under-stimulated, needs challenge)
    """
    states = []
    for row in y_arr:
        b, e, c, f = row[0], row[1], row[2], row[3]
        if c >= 2 or f >= 2:
            states.append(1)  # Overload / Confusion
        elif b >= 2 or e <= 1:
            states.append(2)  # Boredom / Disengaged
        else:
            states.append(0)  # Flow
    return np.array(states, dtype=np.int64)

def extract_window_summary(X_seq, y_states, split_name):
    """
    Compute statistical summary metrics per 11-frame window:
      - mean: average activation across window
      - std: volatility / variance of expression
      - max: peak intensity
      - trend: delta between second half and first half of window
    """
    rows = []
    for i in range(len(X_seq)):
        sample = X_seq[i] # Shape: (11, 7)
        feat_dict = {'split': split_name, 'cognitive_state': y_states[i]}
        
        means = sample.mean(axis=0)
        stds = sample.std(axis=0)
        maxs = sample.max(axis=0)
        trends = sample[6:, :].mean(axis=0) - sample[:5, :].mean(axis=0)
        
        for ch_idx, ch_name in enumerate(EMOTION_NAMES):
            feat_dict[f'{ch_name}_mean'] = round(float(means[ch_idx]), 4)
            feat_dict[f'{ch_name}_std'] = round(float(stds[ch_idx]), 4)
            feat_dict[f'{ch_name}_max'] = round(float(maxs[ch_idx]), 4)
            feat_dict[f'{ch_name}_trend'] = round(float(trends[ch_idx]), 4)
            
        rows.append(feat_dict)
    return rows

def process_dataset():
    print("=" * 60)
    print(" CogFlow DAiSEE Data Processing Pipeline")
    print("=" * 60)
    
    # Load raw DAiSEE arrays
    X_train = np.load(os.path.join(DATA_DIR, 'X_Train.npy'))
    y_train = np.load(os.path.join(DATA_DIR, 'y_Train.npy')).squeeze()
    X_val = np.load(os.path.join(DATA_DIR, 'X_Validation.npy'))
    y_val = np.load(os.path.join(DATA_DIR, 'y_Validation.npy')).squeeze()
    X_test = np.load(os.path.join(DATA_DIR, 'X_Test.npy'))
    y_test = np.load(os.path.join(DATA_DIR, 'y_Test.npy')).squeeze()

    print(f"Loaded raw arrays from: {DATA_DIR}")
    print(f"  Train: X={X_train.shape}, y={y_train.shape}")
    print(f"  Val:   X={X_val.shape}, y={y_val.shape}")
    print(f"  Test:  X={X_test.shape}, y={y_test.shape}")

    # Map labels to CogFlow 3-class system
    y_train_c = map_labels(y_train)
    y_val_c = map_labels(y_val)
    y_test_c = map_labels(y_test)

    class_names = ['0: Flow', '1: Overload/Confusion', '2: Boredom']
    print("\nClass Distributions:")
    for split_name, arr in [('Train', y_train_c), ('Val', y_val_c), ('Test', y_test_c)]:
        counts = np.bincount(arr, minlength=3)
        pcts = (counts / len(arr)) * 100
        print(f"  {split_name:5s}: Total={len(arr)} | " + 
              " | ".join([f"{class_names[i]}: {counts[i]} ({pcts[i]:.1f}%)" for i in range(3)]))

    # Save processed tensors in NPZ format
    npz_path = os.path.join(DATA_DIR, 'daisee_cogflow_processed.npz')
    np.savez_compressed(
        npz_path,
        X_train=X_train, y_train=y_train_c,
        X_val=X_val, y_val=y_val_c,
        X_test=X_test, y_test=y_test_c
    )
    print(f"\nSaved compressed sequence tensors to:\n  -> {npz_path}")

    # Generate tabular summary CSV
    print("\nGenerating tabular window summary CSV...")
    all_rows = []
    all_rows.extend(extract_window_summary(X_train, y_train_c, 'train'))
    all_rows.extend(extract_window_summary(X_val, y_val_c, 'val'))
    all_rows.extend(extract_window_summary(X_test, y_test_c, 'test'))
    
    df_summary = pd.DataFrame(all_rows)
    csv_path = os.path.join(DATA_DIR, 'daisee_summary_features.csv')
    df_summary.to_csv(csv_path, index=False)
    print(f"Saved tabular features ({len(df_summary)} rows x {df_summary.shape[1]} cols) to:\n  -> {csv_path}")

    print("\nData preparation complete!")

if __name__ == '__main__':
    process_dataset()
