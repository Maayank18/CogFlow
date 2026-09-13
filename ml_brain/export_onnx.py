import torch
from model import CogFlowModel

def export_to_onnx():
    print("Loading trained PyTorch model...")
    
    # Step 1: Initialize the model architecture structure
    model = CogFlowModel()
    
    # Step 2: Load the trained weights (.pth) into the model state dictionary
    model.load_state_dict(torch.load('exported_models/cogflow_model.pth', weights_only=True))
    
    # Step 3: Switch the model to evaluation mode
    model.eval() 
    
    # Step 4: Create a dummy input tensor matching the 5-feature telemetry structure
    dummy_input = torch.randn(1, 5)
    
    # Step 5: Define the destination file path for the exported ONNX model
    onnx_file_path = "exported_models/cogflow_model.onnx"
    
    print("Exporting model to ONNX format for browser deployment...")
    
    # Step 6: Export the PyTorch model to ONNX format (passing dummy_input inside a tuple)
    torch.onnx.export(
        model,                        # Target PyTorch model instance
        (dummy_input,),               # Model inputs wrapped in a tuple (fixes the Pylance warning)
        onnx_file_path,               # Output file path for the ONNX file
        export_params=True,           # Store trained parameter weights inside the model file
        opset_version=18,             # ONNX specification opset version
        input_names=['input_signals'],        # Custom identifier for the input layer
        output_names=['cognitive_state_probs'] # Custom identifier for the output layer
    )
    
    print(f"Success! 🚀 ONNX model smoothly exported to '{onnx_file_path}'")
    print("Ab ye file frontend me seedha chalne ke liye ready hai!")

if __name__ == "__main__":
    export_to_onnx()