
# # ai_engine.py
# import cv2
# import mediapipe as mp
# from ultralytics import YOLO
# import numpy as np

# MODEL_PATH = r"C:\models\yolov8n.pt"
# model = YOLO(MODEL_PATH)

# mp_face_detection = mp.solutions.face_detection
# mp_face_mesh = mp.solutions.face_mesh


# class AIEngine:
#     def __init__(self):
#         self.face_detection = mp_face_detection.FaceDetection(0, 0.5)
#         self.face_mesh = mp_face_mesh.FaceMesh(
#             max_num_faces=5,
#             min_detection_confidence=0.5,
#             min_tracking_confidence=0.5
#         )
#         self.no_face_counter = 0

#     def get_head_pose(self, frame, face_landmarks):
#         h, w, _ = frame.shape

#         # 2D points from face
#         face_2d = []
#         face_3d = []

#         for idx, lm in enumerate(face_landmarks.landmark):
#             if idx in [33, 263, 1, 61, 291, 199]:  # key points
#                 x, y = int(lm.x * w), int(lm.y * h)

#                 face_2d.append([x, y])
#                 face_3d.append([lm.x * w, lm.y * h, lm.z * 3000])

#         face_2d = np.array(face_2d, dtype=np.float64)
#         face_3d = np.array(face_3d, dtype=np.float64)

#         # Camera matrix
#         focal_length = w
#         cam_matrix = np.array([
#             [focal_length, 0, w / 2],
#             [0, focal_length, h / 2],
#             [0, 0, 1]
#         ])

#         dist_matrix = np.zeros((4, 1), dtype=np.float64)

#         success, rot_vec, trans_vec = cv2.solvePnP(
#             face_3d, face_2d, cam_matrix, dist_matrix
#         )

#         rmat, _ = cv2.Rodrigues(rot_vec)
#         angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)

#         x, y, z = angles  # rotation

#         return x, y, z

#     def process_frame(self, frame):

#         violations = []

#         h, w, _ = frame.shape
#         rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

#         #  PHONE DETECTION
#         results = model(frame, verbose=False)

#         for r in results:

#             if r.boxes is None:
#                 continue

#             for box in r.boxes:

#                 cls = int(box.cls.item())
#                 conf = float(box.conf.item())

#                 # print("DETECTED:", cls, conf)

#                 if cls == 67 and conf > 0.3:

#                     print("📱 PHONE DETECTED")

#                     violations.append("MOBILE_PHONE_DETECTED")

#         #  FACE DETECTION
#         res = self.face_detection.process(rgb)

#         face_count = len(res.detections) if res.detections else 0

#         if face_count == 0:
#             self.no_face_counter += 1
#         else:
#             self.no_face_counter = 0

#         if self.no_face_counter > 3:
#             violations.append("NO_FACE_DETECTED")

#         if face_count > 1:
#             violations.append("MULTIPLE_FACES_DETECTED")

#         mesh_results = self.face_mesh.process(rgb)

#         if mesh_results.multi_face_landmarks:
#             for face_landmarks in mesh_results.multi_face_landmarks:
#                 x, y, z = self.get_head_pose(frame, face_landmarks)

#                 # 🔻 LOOKING DOWN
#                 if x > 5:
#                     print("Looking Down")
#                     violations.append("LOOKING_DOWN")

#                 # 👈 👉 LOOKING SIDE
#                 if y > 5:
#                     print("Looking Right")
#                     violations.append("LOOKING_RIGHT")
#                 elif y < -5:
#                     print("Looking Left")
#                     violations.append("LOOKING_LEFT")

        
#         return violations


# ai_engine.py
import cv2
import mediapipe as mp
from ultralytics import YOLO
import numpy as np

MODEL_PATH = r"C:\models\yolov8n.pt"
model = YOLO(MODEL_PATH)

mp_face_detection = mp.solutions.face_detection
mp_face_mesh = mp.solutions.face_mesh


class AIEngine:
    def __init__(self):
        self.face_detection = mp_face_detection.FaceDetection(0, 0.5)
        self.face_mesh = mp_face_mesh.FaceMesh(
            max_num_faces=1,  # ✅ only one face for stability
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

        self.no_face_counter = 0

        # ✅ smoothing variables
        self.prev_x = 0
        self.prev_y = 0

        # ✅ frame consistency counters
        self.direction_counter = {
            "LEFT": 0,
            "RIGHT": 0,
            "DOWN": 0
        }

    def get_head_pose(self, frame, face_landmarks):
        h, w, _ = frame.shape

        face_2d = []
        face_3d = []

        for idx, lm in enumerate(face_landmarks.landmark):
            if idx in [33, 263, 1, 61, 291, 199]:
                x, y = int(lm.x * w), int(lm.y * h)

                face_2d.append([x, y])
                face_3d.append([lm.x * w, lm.y * h, lm.z * 3000])  # ✅ fixed

        face_2d = np.array(face_2d, dtype=np.float64)
        face_3d = np.array(face_3d, dtype=np.float64)

        focal_length = w
        cam_matrix = np.array([
            [focal_length, 0, w / 2],
            [0, focal_length, h / 2],
            [0, 0, 1]
        ])

        dist_matrix = np.zeros((4, 1), dtype=np.float64)

        success, rot_vec, trans_vec = cv2.solvePnP(
            face_3d, face_2d, cam_matrix, dist_matrix
        )

        rmat, _ = cv2.Rodrigues(rot_vec)
        angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)

        return angles  # x, y, z

    def process_frame(self, frame):

        violations = []

        h, w, _ = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # 📱 PHONE DETECTION
        results = model(frame, verbose=False)

        for r in results:
            if r.boxes is None:
                continue

            for box in r.boxes:
                cls = int(box.cls.item())
                conf = float(box.conf.item())

                if cls == 67 and conf > 0.3:
                    violations.append("MOBILE_PHONE_DETECTED")

        # 👤 FACE DETECTION
        res = self.face_detection.process(rgb)
        face_count = len(res.detections) if res.detections else 0

        if face_count == 0:
            self.no_face_counter += 1
        else:
            self.no_face_counter = 0

        if self.no_face_counter > 3:
            violations.append("NO_FACE_DETECTED")

        if face_count > 1:
            violations.append("MULTIPLE_FACES_DETECTED")

        # 🧠 HEAD POSE
        mesh_results = self.face_mesh.process(rgb)

        if mesh_results.multi_face_landmarks:

            # ✅ use only first face
            face_landmarks = mesh_results.multi_face_landmarks[0]

            x, y, z = self.get_head_pose(frame, face_landmarks)

            # ✅ smoothing (IMPORTANT)
            x = 0.7 * self.prev_x + 0.3 * x
            y = 0.7 * self.prev_y + 0.3 * y

            self.prev_x = x
            self.prev_y = y

            # ✅ dead zone
            if abs(x) < 5:
                x = 0
            if abs(y) < 5:
                y = 0

            # ✅ DEBUG (remove later)
            print(f"X:{x:.2f}, Y:{y:.2f}")

            # ✅ RIGHT
            if y > 6:
                self.direction_counter["RIGHT"] += 1
            else:
                self.direction_counter["RIGHT"] = 0

            if self.direction_counter["RIGHT"] > 3:
                violations.append("LOOKING_RIGHT")

            # ✅ LEFT
            if y < -6:
                self.direction_counter["LEFT"] += 1
            else:
                self.direction_counter["LEFT"] = 0

            if self.direction_counter["LEFT"] > 3:
                violations.append("LOOKING_LEFT")

            # ✅ DOWN
            if x > 6:
                self.direction_counter["DOWN"] += 1
            else:
                self.direction_counter["DOWN"] = 0

            if self.direction_counter["DOWN"] > 3:
                violations.append("LOOKING_DOWN")

        return violations