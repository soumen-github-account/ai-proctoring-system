import cv2
import mediapipe as mp
import numpy as np
from ultralytics import YOLO

MODEL_PATH = r"C:\models\yolov8n.pt"  # change path
model = YOLO(MODEL_PATH)

mp_face_detection = mp.solutions.face_detection
mp_face_mesh = mp.solutions.face_mesh


class AIEngine:

    def __init__(self):
        self.face_detection = mp_face_detection.FaceDetection(
            model_selection=0,
            min_detection_confidence=0.5
        )

        self.face_mesh = mp_face_mesh.FaceMesh(
            max_num_faces=5,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

        self.no_face_counter = 0
        self.counters_dict = {}

    def process_frame(self, frame):

        violations = []
        h, w, _ = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # ================= MOBILE DETECTION =================
        results = model(frame)

        for result in results:
            for cls, conf in zip(result.boxes.cls, result.boxes.conf):
                if int(cls) == 67 and conf > 0.25:
                    violations.append("MOBILE_PHONE_DETECTED")

        # ================= FACE DETECTION =================
        detection_results = self.face_detection.process(rgb)

        faces = []
        if detection_results.detections:
            for idx, detection in enumerate(detection_results.detections):
                faces.append(idx)

        if len(faces) == 0:
            self.no_face_counter += 1
        else:
            self.no_face_counter = 0

        if self.no_face_counter > 10:
            violations.append("NO_FACE_DETECTED")

        if len(faces) > 1:
            violations.append("MULTIPLE_FACES_DETECTED")

        # ================= HEAD MOVEMENT =================
        mesh_results = self.face_mesh.process(rgb)

        if mesh_results.multi_face_landmarks:
            for face_idx, landmarks in enumerate(
                    mesh_results.multi_face_landmarks):

                if face_idx not in self.counters_dict:
                    self.counters_dict[face_idx] = {
                        "left": 0,
                        "right": 0
                    }

                lm = landmarks.landmark

                nose = lm[1]
                left_eye = lm[33]
                right_eye = lm[263]

                nose_x = int(nose.x * w)
                eye_center_x = (left_eye.x + right_eye.x) / 2 * w
                face_height = abs(
                    (lm[152].y - lm[10].y) * h
                )

                threshold = 0.07 * face_height

                if nose_x < eye_center_x - threshold:
                    self.counters_dict[face_idx]["left"] += 1

                elif nose_x > eye_center_x + threshold:
                    self.counters_dict[face_idx]["right"] += 1

                if (
                    self.counters_dict[face_idx]["left"] > 20 or
                    self.counters_dict[face_idx]["right"] > 20
                ):
                    violations.append("HEAD_MOVEMENT_SUSPICIOUS")

        return violations
