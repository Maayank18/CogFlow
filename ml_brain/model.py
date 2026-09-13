import torch
import torch.nn as nn

class CogFlowModel(nn.Module):
    def __init__(self, input_size=5, hidden_size1=64, hidden_size2=32, num_classes=3):
        super(CogFlowModel, self).__init__()
        
        # First hidden layer mapping 5 input telemetry features to 64 hidden neurons
        self.fc1 = nn.Linear(input_size, hidden_size1)
        self.relu1 = nn.ReLU()
        
        # Second hidden layer mapping 64 neurons down to 32 neurons for feature compression
        self.fc2 = nn.Linear(hidden_size1, hidden_size2)
        self.relu2 = nn.ReLU()
        
        # Output layer mapping 32 features to 3 classification logits (Flow, Overload, Boredom)
        self.fc3 = nn.Linear(hidden_size2, num_classes)

    def forward(self, x):
        # Define the forward pass propagation through linear and activation layers
        out = self.fc1(x)
        out = self.relu1(out)
        
        out = self.fc2(out)
        out = self.relu2(out)
        
        out = self.fc3(out)  # Returns raw logits for the 3 target cognitive states
        return out

# Standalone execution block for architecture testing and dimension validation
if __name__ == "__main__":
    # Create a synthetic input tensor simulating a 5-feature telemetry batch vector
    dummy_input = torch.randn(1, 5) 
    model = CogFlowModel()
    output = model(dummy_input)
    
    print("Model Architecture:\n", model)
    print("\nDummy Input Shape:", dummy_input.shape)
    print("Model Output Shape:", output.shape)
    print("Model Output (Raw Logits):", output)