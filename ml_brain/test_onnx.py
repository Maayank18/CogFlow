import onnxruntime as ort
import numpy as np

def test_onnx_inference():
    print("Loading ONNX model for testing...")
    
    # Step 1: Initialize the ONNX runtime inference session with the exported model
    onnx_file_path = "exported_models/cogflow_model.onnx"
    session = ort.InferenceSession(onnx_file_path)
    
    # Step 2: Retrieve the name of the model's input layer dynamically
    input_name = session.get_inputs()[0].name
    
    # Step 3: Create a dummy telemetry sample mimicking WebGazer/MediaPipe signals
    # Features: [gaze_variance, blink_rate, facial_tension, mouse_speed, typing_gap]
    # These sample values represent an ideal "Flow" state condition
    sample_input = np.array([[20.5, 18.2, 0.2, 30.0, 0.3]], dtype=np.float32)
    
    print(f"Feeding 5 input signals to the model: {sample_input[0]}")
    
    # Step 4: Execute model inference using the ONNX runtime session
    predictions = session.run(None, {input_name: sample_input})
    
    # Step 5: Extract logits and map them to cognitive states
    logits = predictions[0][0]  # type: ignore
    states = ["Flow (Optimal)", "Overload (Stressed)", "Boredom (Disengaged)"]
    
    # Determine the target state corresponding to the highest probability score
    predicted_index = np.argmax(logits)
    
    print("\n" + "="*30)
    print("🧠 COGFLOW AI PREDICTION")
    print("="*30)
    print(f"Raw Scores: {logits}")
    print(f"Predicted State: ** {states[predicted_index]} **")
    print("="*30)

if __name__ == "__main__":
    test_onnx_inference()