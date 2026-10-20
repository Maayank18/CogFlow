"""
CogFlow Real-Time Webcam Cognitive State Monitor
================================================
Uses the modern MediaPipe 1.x Tasks API (FaceLandmarker) with 52 FACS Blendshapes:
  - Brow Down (AU4): Brow furrowing / mental effort / confusion
  - Eye Squint (AU7): Eyelid tightening / visual strain
  - Eye Blink (AU45): Blink dynamics
  - Jaw Open (AU26): Yawn / fatigue indicator
  - Smile / Frown: Affective valence

Includes:
  1. 5-second automatic neutral baseline calibration
  2. Live second-by-second cognitive state classification (Flow, Overload, Boredom)
  3. The 30-Second Sustained Rule:
     Triggers a polite adaptation banner ONLY when Overload or Boredom persists for 30s.

Press 'q' in the camera window to exit.
"""

import os
import cv2
import time
import math
import urllib.request
import numpy as np

import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'face_landmarker.task')
MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

def ensure_model_exists():
    """Download the official MediaPipe FaceLandmarker task model if missing."""
    if not os.path.exists(MODEL_PATH):
        print(f"Downloading face_landmarker.task model ({MODEL_URL})...")
        urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
        print(f"Downloaded model to {MODEL_PATH} ({os.path.getsize(MODEL_PATH)/(1024*1024):.1f} MB)")

def extract_blendshapes_dict(detection_result):
    """Convert detection result blendshapes to a convenient dictionary."""
    if not detection_result.face_blendshapes or len(detection_result.face_blendshapes) == 0:
        return {}
    category_list = detection_result.face_blendshapes[0]
    return {c.category_name: c.score for c in category_list}

def run_webcam_monitor():
    print("=" * 65)
    print(" CogFlow Live Webcam Cognitive State Monitor")
    print(" Powered by MediaPipe Face Landmarker & FACS Blendshapes")
    print("=" * 65)

    ensure_model_exists()

    # 1. Initialize FaceLandmarker with Blendshapes enabled
    base_options = python.BaseOptions(model_asset_path=MODEL_PATH)
    options = vision.FaceLandmarkerOptions(
        base_options=base_options,
        output_face_blendshapes=True,
        output_facial_transformation_matrixes=True,
        num_faces=1
    )
    detector = vision.FaceLandmarker.create_from_options(options)

    # 2. Open Webcam
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam. Please verify camera permissions.")
        return

    print("\nWebcam started!")
    print("Phase 1: Calibrating neutral baseline for 5 seconds. Look normally at your screen...")

    # Calibration variables
    calibration_samples = []
    baseline_brow_down = 0.0
    baseline_squint = 0.0
    is_calibrated = False

    # State tracking & 30-Second Rule
    current_state = "Calibrating..."
    sustained_state = "Flow"
    sustained_seconds = 0
    last_second_time = time.time()
    popup_message = ""
    popup_timer = 0.0

    # Key landmark indices for visual feedback
    BROW_PTS = [70, 63, 105, 66, 107, 336, 296, 334, 293, 300]
    EYE_PTS = [33, 160, 158, 133, 153, 144, 362, 385, 387, 263, 373, 380]

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1) # Mirror preview
        h, w, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Wrap frame into MediaPipe Image format
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        detection_result = detector.detect(mp_image)

        brow_val = 0.0
        squint_val = 0.0
        blink_val = 0.0
        jaw_val = 0.0

        if detection_result.face_landmarks and len(detection_result.face_landmarks) > 0:
            landmarks = detection_result.face_landmarks[0]
            blendshapes = extract_blendshapes_dict(detection_result)

            # Draw subtle feature dots on eyes and eyebrows
            for idx in BROW_PTS:
                pt = (int(landmarks[idx].x * w), int(landmarks[idx].y * h))
                cv2.circle(frame, pt, 2, (0, 255, 255), -1)
            for idx in EYE_PTS:
                pt = (int(landmarks[idx].x * w), int(landmarks[idx].y * h))
                cv2.circle(frame, pt, 2, (255, 200, 0), -1)

            # Extract Core Action Units:
            # AU4: Brow Lowerer
            brow_val = (blendshapes.get('browDownLeft', 0.0) + blendshapes.get('browDownRight', 0.0)) / 2.0
            # AU7: Lid Tightener / Squint
            squint_val = (blendshapes.get('eyeSquintLeft', 0.0) + blendshapes.get('eyeSquintRight', 0.0)) / 2.0
            # AU45: Blink
            blink_val = (blendshapes.get('eyeBlinkLeft', 0.0) + blendshapes.get('eyeBlinkRight', 0.0)) / 2.0
            # AU26: Jaw Open
            jaw_val = blendshapes.get('jawOpen', 0.0)

            # Calculate Head Pitch from 3D Landmarks
            lm_10 = landmarks[10]   # Forehead
            lm_152 = landmarks[152] # Chin
            face_h = math.sqrt((lm_10.x - lm_152.x)**2 + (lm_10.y - lm_152.y)**2)
            pitch_ratio = float((lm_10.z - lm_152.z) / face_h) if face_h > 0 else 0.0

            # Phase 1: Calibration (First 5 seconds = ~150 frames)
            if not is_calibrated:
                calibration_samples.append((brow_val, squint_val))
                calib_secs = min(5, len(calibration_samples) // 30)
                current_state = f"Calibrating Baseline... ({calib_secs}s / 5s)"
                
                if len(calibration_samples) >= 150:
                    baseline_brow_down = float(np.mean([s[0] for s in calibration_samples]))
                    baseline_squint = float(np.mean([s[1] for s in calibration_samples]))
                    is_calibrated = True
                    print(f"\n[OK] Calibration complete! Baseline BrowDown={baseline_brow_down:.4f}, Squint={baseline_squint:.4f}")
            else:
                # Phase 2: Calibrated Live Inference
                delta_brow = brow_val - baseline_brow_down
                delta_squint = squint_val - baseline_squint

                # Rule 1: Closed eyes / Head up looking at ceiling -> Disengaged / Fatigue
                if blink_val > 0.55:
                    detected_state = "Boredom / Disengaged"
                    state_color = (255, 165, 0) # Orange
                # Rule 2: Head severely tilted away from screen
                elif pitch_ratio > 0.45 or pitch_ratio < -0.50:
                    detected_state = "Boredom / Disengaged"
                    state_color = (255, 165, 0) # Orange
                # Rule 3: Yawning
                elif jaw_val > 0.35:
                    detected_state = "Boredom / Disengaged"
                    state_color = (255, 165, 0) # Orange
                # Rule 4: Brow Furrow (AU4) / Confusion / Strain
                elif delta_brow > 0.030 or (delta_brow > 0.015 and delta_squint > 0.15):
                    detected_state = "Overload / Confusion"
                    state_color = (0, 0, 255) # Red
                else:
                    detected_state = "Flow (Engaged)"
                    state_color = (0, 255, 0) # Green

                current_state = detected_state

                # Check 30-Second Sustained Rule (updated once per second)
                now = time.time()
                if now - last_second_time >= 1.0:
                    last_second_time = now
                    if detected_state == sustained_state:
                        sustained_seconds += 1
                    else:
                        sustained_state = detected_state
                        sustained_seconds = 1

                    # Trigger polite prompt ONLY when sustained for 30 consecutive seconds
                    if sustained_seconds >= 30:
                        if sustained_state == "Overload / Confusion":
                            popup_message = "You seem stuck or confused -- Would you like to simplify this?"
                            popup_timer = 10.0 # Show prompt for 10 seconds
                        elif sustained_state == "Boredom / Disengaged":
                            popup_message = "Finding this too slow? -- Level up to a challenge?"
                            popup_timer = 10.0
                        sustained_seconds = 0 # Reset so it does not spam
        else:
            current_state = "No Face Detected"

        # ── UI HUD Overlays ──
        # Top Header Box
        overlay = frame.copy()
        cv2.rectangle(overlay, (10, 10), (w - 10, 110), (20, 20, 20), -1)
        cv2.addWeighted(overlay, 0.75, frame, 0.25, 0, frame)
        cv2.rectangle(frame, (10, 10), (w - 10, 110), (70, 70, 70), 1)

        # State text
        state_color = (0, 255, 0) if "Flow" in current_state else ((0, 0, 255) if "Overload" in current_state else (255, 165, 0))
        cv2.putText(frame, f"Cognitive State: {current_state}", (25, 45), cv2.FONT_HERSHEY_SIMPLEX, 0.8, state_color, 2)
        cv2.putText(frame, f"Sustained: {sustained_state} ({sustained_seconds}s / 30s threshold)", (25, 75), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (200, 200, 200), 1)
        
        # Real-time metrics bar
        metrics_str = f"Brow AU4: {brow_val:.2f} | Squint AU7: {squint_val:.2f} | Jaw: {jaw_val:.2f}"
        cv2.putText(frame, metrics_str, (25, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (160, 160, 160), 1)

        # 30-Second Prompt Banner
        if popup_timer > 0:
            popup_timer -= 0.033 # roughly decrement per frame at 30fps
            banner_overlay = frame.copy()
            cv2.rectangle(banner_overlay, (20, h - 90), (w - 20, h - 20), (30, 30, 30), -1)
            cv2.addWeighted(banner_overlay, 0.85, frame, 0.15, 0, frame)
            cv2.rectangle(frame, (20, h - 90), (w - 20, h - 20), (0, 215, 255), 2)
            cv2.putText(frame, f"[COGFLOW SUGGESTION]: {popup_message}", (35, h - 48),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 255), 2)
            cv2.putText(frame, "(Active student consent -- Click or choose to adapt)", (35, h - 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.42, (180, 180, 180), 1)

        cv2.imshow("CogFlow - Real-Time Facial Cognitive Load Monitor", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    print("Webcam monitor stopped.")

if __name__ == '__main__':
    run_webcam_monitor()
