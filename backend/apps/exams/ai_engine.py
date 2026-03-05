
# ai_engine.py
import cv2
import mediapipe as mp
from ultralytics import YOLO

MODEL_PATH = r"C:\models\yolov8n.pt"
model = YOLO(MODEL_PATH)

mp_face_detection = mp.solutions.face_detection
mp_face_mesh = mp.solutions.face_mesh


class AIEngine:
    def __init__(self):
        self.face_detection = mp_face_detection.FaceDetection(0, 0.5)
        self.face_mesh = mp_face_mesh.FaceMesh(
            max_num_faces=5,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.no_face_counter = 0

    def process_frame(self, frame):
        violations = []
        h, w, _ = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # MOBILE
        results = model(frame, verbose=False)
        for r in results:
            for cls, conf in zip(r.boxes.cls, r.boxes.conf):
                if int(cls) == 67 and conf > 0.3:
                    violations.append("MOBILE_PHONE_DETECTED")

        # FACE
        res = self.face_detection.process(rgb)
        face_count = len(res.detections) if res.detections else 0

        if face_count == 0:
            self.no_face_counter += 1
        else:
            self.no_face_counter = 0

        if self.no_face_counter > 10:
            violations.append("NO_FACE_DETECTED")

        if face_count > 1:
            violations.append("MULTIPLE_FACES_DETECTED")

        return violations