import torch
import torch.nn as nn
import torch.nn.functional as F

class TemporalAttention(nn.Module):
    """
    Learns an attention weight for each timestep in the 11-frame window,
    allowing the model to focus on the most diagnostic moments (e.g. peak brow furrow).
    """
    def __init__(self, hidden_dim):
        super(TemporalAttention, self).__init__()
        self.projection = nn.Sequential(
            nn.Linear(hidden_dim, 32),
            nn.Tanh(),
            nn.Linear(32, 1)
        )

    def forward(self, lstm_outputs):
        # lstm_outputs shape: (batch_size, seq_len, hidden_dim)
        energy = self.projection(lstm_outputs) # (batch_size, seq_len, 1)
        weights = F.softmax(energy, dim=1)     # (batch_size, seq_len, 1)
        context = torch.sum(lstm_outputs * weights, dim=1) # (batch_size, hidden_dim)
        return context, weights


class CogFlowSequenceModel(nn.Module):
    """
    BiLSTM + Temporal Attention Model for Sequence-level Facial Telemetry.
    Input: (batch_size, seq_len=11, num_features=7)
    Output: 3 class logits (0: Flow, 1: Overload/Confusion, 2: Boredom)
    """
    def __init__(self, input_dim=7, hidden_dim=64, num_layers=2, num_classes=3, dropout=0.25):
        super(CogFlowSequenceModel, self).__init__()
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.num_classes = num_classes

        # Bidirectional LSTM to capture forward & backward temporal dynamics
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=True,
            dropout=dropout if num_layers > 1 else 0.0
        )
        
        lstm_out_dim = hidden_dim * 2 # Bidirectional
        self.attention = TemporalAttention(lstm_out_dim)

        # Classification Head
        self.classifier = nn.Sequential(
            nn.Linear(lstm_out_dim, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(64, num_classes)
        )

    def forward(self, x):
        # x: (batch_size, seq_len, input_dim)
        lstm_out, _ = self.lstm(x) # (batch_size, seq_len, hidden_dim * 2)
        context, _ = self.attention(lstm_out) # (batch_size, hidden_dim * 2)
        logits = self.classifier(context) # (batch_size, num_classes)
        return logits


class CogFlowTabularModel(nn.Module):
    """
    MLP with Residual connection for 28 aggregated window statistical features.
    Input: (batch_size, 28)
    Output: 3 class logits
    """
    def __init__(self, input_dim=28, hidden_dim=64, num_classes=3, dropout=0.25):
        super(CogFlowTabularModel, self).__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.bn1 = nn.BatchNorm1d(hidden_dim)
        
        self.fc2 = nn.Linear(hidden_dim, hidden_dim)
        self.bn2 = nn.BatchNorm1d(hidden_dim)
        
        self.fc3 = nn.Linear(hidden_dim, 32)
        self.dropout = nn.Dropout(dropout)
        self.out = nn.Linear(32, num_classes)

    def forward(self, x):
        # Initial projection
        h = F.relu(self.bn1(self.fc1(x)))
        # Residual block
        residual = h
        h = F.relu(self.bn2(self.fc2(h))) + residual
        # Output
        h = self.dropout(F.relu(self.fc3(h)))
        logits = self.out(h)
        return logits


if __name__ == "__main__":
    # Test dimension compatibility
    seq_input = torch.randn(4, 11, 7)
    seq_model = CogFlowSequenceModel()
    seq_out = seq_model(seq_input)
    print("CogFlowSequenceModel Output Shape:", seq_out.shape)

    tab_input = torch.randn(4, 28)
    tab_model = CogFlowTabularModel()
    tab_out = tab_model(tab_input)
    print("CogFlowTabularModel Output Shape:", tab_out.shape)