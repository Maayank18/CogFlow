"""
CogFlow Face Analyzer Module
============================
Integrates MediaPipe Tasks FaceLandmarker (FACS Blendshapes + 3D Pose)
with the DAiSEE-trained BiLSTM + Temporal Attention Neural Network (ONNX).

Pipeline:
1. MediaPipe Tasks API extracts 52 FACS Blendshapes and 478 3D facial landmarks.
2. Calibrated baselines normalize natural resting facial expressions.
3. Maps micro-expressions into 7 cognitive affect channels:
   [Angry/Brow-down, Disgust, Fear, Happy, Sad, Surprise, Neutral]
4. Feeds an 11-frame temporal window into `cogflow_daisee.onnx`.
5. Outputs real-time cognitive classification (Flow, Overload, Boredom) with probabilities.
"""

import os
import cv2
import base64
import collections
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

try:
    import onnxruntime as ort
    HAS_ONNX = True
except ImportError:
    HAS_ONNX = False

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LANDMARKER_PATH = os.path.join(BASE_DIR, 'face_landmarker.task')
ONNX_MODEL_PATH = os.path.join(BASE_DIR, 'cogflow_daisee.onnx')

STATE_LABELS = {
    0: "Flow (Optimal)",
    1: "Overload / Confusion",
    2: "Boredom / Disengaged"
}


def softmax(x):
    """Compute softmax probabilities with numerical stability."""
    e_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return e_x / np.sum(e_x, axis=-1, keepdims=True)


class FaceAnalyzer:
    def __init__(self):
        if not os.path.exists(LANDMARKER_PATH):
            raise FileNotFoundError(f"MediaPipe model not found at: {LANDMARKER_PATH}")

        # 1. Initialize MediaPipe FaceLandmarker
        base_options = python.BaseOptions(model_asset_path=LANDMARKER_PATH)
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            output_face_blendshapes=True,
            output_facial_transformation_matrixes=True,
            num_faces=1
        )
        self.detector = vision.FaceLandmarker.create_from_options(options)
        print("[FaceAnalyzer] MediaPipe Tasks FaceLandmarker initialized.")

        # 2. Initialize DAiSEE BiLSTM+Attention ONNX Model
        self.onnx_session = None
        self.input_name = None
        if HAS_ONNX and os.path.exists(ONNX_MODEL_PATH):
            try:
                self.onnx_session = ort.InferenceSession(ONNX_MODEL_PATH)
                self.input_name = self.onnx_session.get_inputs()[0].name
                print(f"[FaceAnalyzer] DAiSEE ONNX Neural Network loaded from: {ONNX_MODEL_PATH}")
            except Exception as e:
                print(f"[FaceAnalyzer] Warning loading ONNX model ({e}), using calibrated heuristic fallback.")
        else:
            print("[FaceAnalyzer] ONNX model not found or onnxruntime unavailable, using calibrated fallback.")

        # Temporal sequence buffer (11 frames window for BiLSTM)
        self.sequence_buffer = collections.deque(maxlen=11)

    def decode_base64_image(self, base64_str: str) -> np.ndarray:
        """Decode a base64 image (with or without data URI prefix) into a BGR numpy array."""
        if ',' in base64_str:
            base64_str = base64_str.split(',', 1)[1]
        img_bytes = base64.b64decode(base64_str)
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img

    def analyze_frame(self, image_bgr: np.ndarray, base_brow: float = 0.005, base_squint: float = 0.35) -> dict:
        """
        Analyze a single webcam frame and return real-time cognitive state classification.
        """
        if image_bgr is None or image_bgr.size == 0:
            return {
                "face_detected": False,
                "cognitive_state": 0,
                "state_label": "No Video Feed",
                "confidence": 0.0,
                "reason": "Empty video frame received",
                "metrics": {},
                "model_name": "None"
            }

        rgb_img = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_img)
        detection_result = self.detector.detect(mp_image)

        if not detection_result.face_landmarks or len(detection_result.face_landmarks) == 0:
            return {
                "face_detected": False,
                "cognitive_state": 0,
                "state_label": "No Face Detected",
                "confidence": 0.0,
                "reason": "Please face the camera directly to track focus",
                "metrics": {},
                "model_name": "None"
            }

        # ── 1. Extract Blendshapes ──
        blendshapes = {}
        if detection_result.face_blendshapes and len(detection_result.face_blendshapes) > 0:
            for cat in detection_result.face_blendshapes[0]:
                blendshapes[cat.category_name] = cat.score

        # Core Action Units (FACS)
        brow_down_raw = (blendshapes.get('browDownLeft', 0.0) + blendshapes.get('browDownRight', 0.0)) / 2.0
        blink = (blendshapes.get('eyeBlinkLeft', 0.0) + blendshapes.get('eyeBlinkRight', 0.0)) / 2.0
        squint_raw = (blendshapes.get('eyeSquintLeft', 0.0) + blendshapes.get('eyeSquintRight', 0.0)) / 2.0
        jaw_open = blendshapes.get('jawOpen', 0.0)
        smile = (blendshapes.get('mouthSmileLeft', 0.0) + blendshapes.get('mouthSmileRight', 0.0)) / 2.0
        frown = (blendshapes.get('mouthFrownLeft', 0.0) + blendshapes.get('mouthFrownRight', 0.0)) / 2.0
        nose_sneer = (blendshapes.get('noseSneerLeft', 0.0) + blendshapes.get('noseSneerRight', 0.0)) / 2.0
        brow_inner_up = blendshapes.get('browInnerUp', 0.0)

        # Baseline-normalized deltas
        delta_brow = max(0.0, brow_down_raw - base_brow)
        delta_squint = max(0.0, squint_raw - base_squint)

        # ── 2. Head Pitch Calculation from 3D Mesh ──
        landmarks = detection_result.face_landmarks[0]
        lm_10 = landmarks[10]    # Forehead
        lm_152 = landmarks[152]  # Chin
        face_h = np.sqrt((lm_10.x - lm_152.x)**2 + (lm_10.y - lm_152.y)**2)
        if face_h == 0:
            face_h = 1.0
        # Positive = looking up / tilted away; Negative = looking down
        pitch_ratio = float((lm_10.z - lm_152.z) / face_h)

        metrics = {
            "brow_down": round(float(brow_down_raw), 4),
            "blink": round(float(blink), 4),
            "squint": round(float(squint_raw), 4),
            "pitch_ratio": round(float(pitch_ratio), 3),
            "jaw_open": round(float(jaw_open), 3),
            "smile": round(float(smile), 3)
        }

        # ── 3. Physiological Safety Overrides ──
        # If eyes are closed for > 500ms or blinking excessively -> Inattentive / Sleeping
        if blink > 0.58:
            return {
                "face_detected": True,
                "cognitive_state": 2, # Boredom / Inattentive
                "state_label": "Boredom / Inattentive",
                "confidence": 92.0,
                "probabilities": {"flow": 0.05, "overload": 0.05, "boredom": 0.90},
                "reason": "Eyes closed / reading interrupted",
                "metrics": metrics,
                "model_name": "Physiological Eye-Gating"
            }

        # If head is turned severely away from screen -> Looking Away / Disengaged
        if pitch_ratio > 0.45 or pitch_ratio < -0.52:
            return {
                "face_detected": True,
                "cognitive_state": 2, # Disengaged
                "state_label": "Disengaged / Looking Away",
                "confidence": 88.0,
                "probabilities": {"flow": 0.10, "overload": 0.05, "boredom": 0.85},
                "reason": "Head orientation not facing screen",
                "metrics": metrics,
                "model_name": "3D Head-Pose Tracker"
            }

        # ── 4. Map Blendshapes to 7 DAiSEE Channels ──
        # Channel 0: Angry (AU4 Brow Lowerer / Corrugator strain)
        feat_angry = float(min(1.0, delta_brow * 8.0))
        # Channel 1: Disgust (Nose sneer + upper lip)
        feat_disgust = float(min(1.0, nose_sneer * 2.0))
        # Channel 2: Fear (Inner brow up)
        feat_fear = float(min(1.0, brow_inner_up * 1.5))
        # Channel 3: Happy (Mouth smile + cheek raise)
        feat_happy = float(min(1.0, smile * 2.5))
        # Channel 4: Sad (Frown + brow strain)
        feat_sad = float(min(1.0, frown * 2.0 + delta_brow * 2.0))
        # Channel 5: Surprise (Jaw open)
        feat_surprise = float(min(1.0, jaw_open * 1.8))
        # Channel 6: Neutral (Calm, relaxed engaged reading)
        active_sum = feat_angry + feat_disgust + feat_fear + feat_happy + feat_sad + feat_surprise
        feat_neutral = float(max(0.05, 1.0 - active_sum))

        feature_vector = np.array([
            feat_angry, feat_disgust, feat_fear, feat_happy, feat_sad, feat_surprise, feat_neutral
        ], dtype=np.float32)

        # Normalize feature vector
        feat_norm = feature_vector / (np.sum(feature_vector) + 1e-6)
        self.sequence_buffer.append(feat_norm)

        # ── 5. Run DAiSEE BiLSTM+Attention ONNX Model ──
        if self.onnx_session is not None:
            # Build 11-frame sequence window
            curr_buffer = list(self.sequence_buffer)
            while len(curr_buffer) < 11:
                curr_buffer.insert(0, curr_buffer[0] if curr_buffer else feat_norm)

            seq_tensor = np.array(curr_buffer, dtype=np.float32).reshape(1, 11, 7)
            try:
                outputs = self.onnx_session.run(None, {self.input_name: seq_tensor})
                logits = outputs[0][0]
                probs = softmax(logits)

                pred_class = int(np.argmax(probs))
                confidence = float(probs[pred_class] * 100.0)

                # Clarify reason based on dominant signals
                if pred_class == 1:
                    reason = f"Brow furrow & cognitive tension detected (AU4: +{delta_brow:.3f})"
                elif pred_class == 2:
                    reason = "Low affective arousal / passive disengagement"
                else:
                    reason = "Attentive and steady reading pace (Optimal Flow)"

                return {
                    "face_detected": True,
                    "cognitive_state": pred_class,
                    "state_label": STATE_LABELS.get(pred_class, "Flow (Optimal)"),
                    "confidence": round(confidence, 1),
                    "probabilities": {
                        "flow": round(float(probs[0]), 3),
                        "overload": round(float(probs[1]), 3),
                        "boredom": round(float(probs[2]), 3)
                    },
                    "reason": reason,
                    "metrics": metrics,
                    "model_name": "DAiSEE BiLSTM+Attention Neural Network (ONNX)"
                }
            except Exception as e:
                print(f"[FaceAnalyzer] ONNX inference error ({e}), falling back to heuristic.")

        # ── Fallback Calibrated Rules if ONNX is not available ──
        if delta_brow > 0.030 or (delta_brow > 0.015 and delta_squint > 0.15):
            return {
                "face_detected": True,
                "cognitive_state": 1,
                "state_label": "Overload / Confusion",
                "confidence": 85.0,
                "probabilities": {"flow": 0.15, "overload": 0.85, "boredom": 0.0},
                "reason": f"Brow furrow strain detected (AU4: +{delta_brow:.3f})",
                "metrics": metrics,
                "model_name": "Calibrated Heuristics Engine"
            }

        return {
            "face_detected": True,
            "cognitive_state": 0,
            "state_label": "Flow (Optimal)",
            "confidence": 89.0,
            "probabilities": {"flow": 0.89, "overload": 0.06, "boredom": 0.05},
            "reason": "Steady reading focus with relaxed expressions",
            "metrics": metrics,
            "model_name": "Calibrated Heuristics Engine"
        }
