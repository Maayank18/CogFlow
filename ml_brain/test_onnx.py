"""
CogFlow ONNX Inference Tester
=============================
Tests the exported ONNX model (`cogflow_daisee.onnx`) with ONNXRuntime.
Simulates 3 distinct 11-frame facial scenarios:
  1. Focused Flow (high engagement/neutral/relaxed expressions)
  2. Overload / Confusion (elevated Angry/Sad/AU4 brow furrowing)
  3. Boredom (flat affect, low arousal, blank neutral expressions)
"""

import os
import numpy as np
import onnxruntime as ort

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'exported_models', 'cogflow_daisee.onnx')
STATES = ["Flow (Optimal)", "Overload / Confusion (Simplify)", "Boredom / Disengaged (Challenge)"]
CHANNELS = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']

def softmax(x):
    e_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return e_x / e_x.sum(axis=-1, keepdims=True)

def run_tests():
    print("=" * 65)
    print(" CogFlow ONNX Model Inference Test")
    print("=" * 65)
    
    if not os.path.exists(MODEL_PATH):
        print(f"Model file not found at: {MODEL_PATH}")
        return

    session = ort.InferenceSession(MODEL_PATH)
    input_name = session.get_inputs()[0].name
    print(f"Loaded ONNX Model: {MODEL_PATH}")
    print(f"Input Node: '{input_name}', Shape: {session.get_inputs()[0].shape}\n")

    # Scenario 1: Simulating Flow (Moderate Happy + Neutral engaged reading)
    # 11 frames x 7 channels
    flow_sample = np.zeros((1, 11, 7), dtype=np.float32)
    flow_sample[:, :, 3] = 0.35  # Happy / Positive affect
    flow_sample[:, :, 6] = 0.65  # Neutral attentiveness

    # Scenario 2: Simulating Overload / Confusion (Strong Brow Furrow / Sad / Angry / Distress)
    confusion_sample = np.zeros((1, 11, 7), dtype=np.float32)
    confusion_sample[:, :, 0] = 0.60  # Angry / AU4 Brow Lowerer (Corrugator strain)
    confusion_sample[:, :, 4] = 0.35  # Sad / Frustration marker
    confusion_sample[:, :, 6] = 0.05

    # Scenario 3: Simulating Boredom (Extreme Flat Neutral / Disengagement / Low Arousal)
    boredom_sample = np.zeros((1, 11, 7), dtype=np.float32)
    boredom_sample[:, :, 6] = 0.98  # Flat neutral stare
    boredom_sample[:, :, 0:6] = 0.00 # Zero expressive micro-movements

    test_cases = [
        ("Scenario 1: Student Reading in Flow (Balanced Attention)", flow_sample),
        ("Scenario 2: Student Struggling with Difficult Text (Confusion / Brow Furrow)", confusion_sample),
        ("Scenario 3: Student Zoned Out / Staring Blankly (Boredom)", boredom_sample)
    ]

    for title, tensor in test_cases:
        print("-" * 65)
        print(title)
        outputs = session.run(None, {input_name: tensor})
        raw_logits = outputs[0][0]
        probs = softmax(raw_logits)
        pred_idx = np.argmax(probs)
        confidence = probs[pred_idx] * 100

        print(f"  Predicted State: ** {STATES[pred_idx]} **")
        print(f"  Confidence:     {confidence:.1f}%")
        print(f"  Probabilities:  Flow={probs[0]:.2f} | Overload={probs[1]:.2f} | Boredom={probs[2]:.2f}")

    print("=" * 65)
    print("All ONNX inference scenarios executed successfully!")

if __name__ == '__main__':
    run_tests()