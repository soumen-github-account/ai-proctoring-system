
# # # ai_engine.py
# # import cv2
# # import mediapipe as mp
# # from ultralytics import YOLO
# # import numpy as np

# # MODEL_PATH = r"C:\models\yolov8n.pt"
# # model = YOLO(MODEL_PATH)

# # mp_face_detection = mp.solutions.face_detection
# # mp_face_mesh = mp.solutions.face_mesh


# # class AIEngine:
# #     def __init__(self):
# #         self.face_detection = mp_face_detection.FaceDetection(0, 0.5)
# #         self.face_mesh = mp_face_mesh.FaceMesh(
# #             max_num_faces=5,
# #             min_detection_confidence=0.5,
# #             min_tracking_confidence=0.5
# #         )
# #         self.no_face_counter = 0

# #     def get_head_pose(self, frame, face_landmarks):
# #         h, w, _ = frame.shape

# #         # 2D points from face
# #         face_2d = []
# #         face_3d = []

# #         for idx, lm in enumerate(face_landmarks.landmark):
# #             if idx in [33, 263, 1, 61, 291, 199]:  # key points
# #                 x, y = int(lm.x * w), int(lm.y * h)

# #                 face_2d.append([x, y])
# #                 face_3d.append([lm.x * w, lm.y * h, lm.z * 3000])

# #         face_2d = np.array(face_2d, dtype=np.float64)
# #         face_3d = np.array(face_3d, dtype=np.float64)

# #         # Camera matrix
# #         focal_length = w
# #         cam_matrix = np.array([
# #             [focal_length, 0, w / 2],
# #             [0, focal_length, h / 2],
# #             [0, 0, 1]
# #         ])

# #         dist_matrix = np.zeros((4, 1), dtype=np.float64)

# #         success, rot_vec, trans_vec = cv2.solvePnP(
# #             face_3d, face_2d, cam_matrix, dist_matrix
# #         )

# #         rmat, _ = cv2.Rodrigues(rot_vec)
# #         angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)

# #         x, y, z = angles  # rotation

# #         return x, y, z

# #     def process_frame(self, frame):

# #         violations = []

# #         h, w, _ = frame.shape
# #         rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

# #         #  PHONE DETECTION
# #         results = model(frame, verbose=False)

# #         for r in results:

# #             if r.boxes is None:
# #                 continue

# #             for box in r.boxes:

# #                 cls = int(box.cls.item())
# #                 conf = float(box.conf.item())

# #                 # print("DETECTED:", cls, conf)

# #                 if cls == 67 and conf > 0.3:

# #                     print("📱 PHONE DETECTED")

# #                     violations.append("MOBILE_PHONE_DETECTED")

# #         #  FACE DETECTION
# #         res = self.face_detection.process(rgb)

# #         face_count = len(res.detections) if res.detections else 0

# #         if face_count == 0:
# #             self.no_face_counter += 1
# #         else:
# #             self.no_face_counter = 0

# #         if self.no_face_counter > 3:
# #             violations.append("NO_FACE_DETECTED")

# #         if face_count > 1:
# #             violations.append("MULTIPLE_FACES_DETECTED")

# #         mesh_results = self.face_mesh.process(rgb)

# #         if mesh_results.multi_face_landmarks:
# #             for face_landmarks in mesh_results.multi_face_landmarks:
# #                 x, y, z = self.get_head_pose(frame, face_landmarks)

# #                 # 🔻 LOOKING DOWN
# #                 if x > 5:
# #                     print("Looking Down")
# #                     violations.append("LOOKING_DOWN")

# #                 # 👈 👉 LOOKING SIDE
# #                 if y > 5:
# #                     print("Looking Right")
# #                     violations.append("LOOKING_RIGHT")
# #                 elif y < -5:
# #                     print("Looking Left")
# #                     violations.append("LOOKING_LEFT")

        
# #         return violations


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
#             max_num_faces=1, 
#             min_detection_confidence=0.5,
#             min_tracking_confidence=0.5
#         )

#         self.no_face_counter = 0

#         # ✅ smoothing variables
#         self.prev_x = 0
#         self.prev_y = 0

#         # ✅ frame consistency counters
#         self.direction_counter = {
#             "LEFT": 0,
#             "RIGHT": 0,
#             "DOWN": 0
#         }

#     def get_head_pose(self, frame, face_landmarks):
#         h, w, _ = frame.shape

#         face_2d = []
#         face_3d = []

#         for idx, lm in enumerate(face_landmarks.landmark):
#             if idx in [33, 263, 1, 61, 291, 199]:
#                 x, y = int(lm.x * w), int(lm.y * h)

#                 face_2d.append([x, y])
#                 face_3d.append([lm.x * w, lm.y * h, lm.z * 3000])  # ✅ fixed

#         face_2d = np.array(face_2d, dtype=np.float64)
#         face_3d = np.array(face_3d, dtype=np.float64)

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

#         return angles  # x, y, z

#     def process_frame(self, frame):

#         violations = []

#         h, w, _ = frame.shape
#         rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

#         # 📱 PHONE DETECTION
#         results = model(frame, verbose=False)

#         for r in results:
#             if r.boxes is None:
#                 continue

#             for box in r.boxes:
#                 cls = int(box.cls.item())
#                 conf = float(box.conf.item())

#                 if cls == 67 and conf > 0.3:
#                     violations.append("MOBILE_PHONE_DETECTED")

#         # 👤 FACE DETECTION
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

#         # 🧠 HEAD POSE
#         mesh_results = self.face_mesh.process(rgb)

#         if mesh_results.multi_face_landmarks:

#             # ✅ use only first face
#             face_landmarks = mesh_results.multi_face_landmarks[0]

#             x, y, z = self.get_head_pose(frame, face_landmarks)

#             # ✅ smoothing (IMPORTANT)
#             x = 0.7 * self.prev_x + 0.3 * x
#             y = 0.7 * self.prev_y + 0.3 * y

#             self.prev_x = x
#             self.prev_y = y

#             # ✅ dead zone
#             if abs(x) < 5:
#                 x = 0
#             if abs(y) < 5:
#                 y = 0

#             # ✅ DEBUG (remove later)
#             print(f"X:{x:.2f}, Y:{y:.2f}")

#             # ✅ RIGHT
#             if y > 6:
#                 self.direction_counter["RIGHT"] += 1
#             else:
#                 self.direction_counter["RIGHT"] = 0

#             if self.direction_counter["RIGHT"] > 3:
#                 violations.append("LOOKING_RIGHT")

#             # ✅ LEFT
#             if y < -6:
#                 self.direction_counter["LEFT"] += 1
#             else:
#                 self.direction_counter["LEFT"] = 0

#             if self.direction_counter["LEFT"] > 3:
#                 violations.append("LOOKING_LEFT")

#             # ✅ DOWN
#             if x > 6:
#                 self.direction_counter["DOWN"] += 1
#             else:
#                 self.direction_counter["DOWN"] = 0

#             if self.direction_counter["DOWN"] > 3:
#                 violations.append("LOOKING_DOWN")

#         return violations

# import cv2
# import mediapipe as mp
# from ultralytics import YOLO
# import numpy as np
# import time

# MODEL_PATH = r"C:\models\yolov8n.pt"
# model = YOLO(MODEL_PATH)

# mp_face_detection = mp.solutions.face_detection
# mp_face_mesh = mp.solutions.face_mesh


# class AIEngine:
#     def __init__(self):
#         self.face_detection = mp_face_detection.FaceDetection(0, 0.5)

#         self.face_mesh = mp_face_mesh.FaceMesh(
#             max_num_faces=1,
#             refine_landmarks=True,  # 🔥 IMPORTANT for eye gaze
#             min_detection_confidence=0.5,
#             min_tracking_confidence=0.5
#         )

#         self.no_face_counter = 0

#         # 🔥 Calibration
#         self.calibrated = False
#         self.base_x = 0
#         self.base_y = 0
#         self.calibration_frames = []

#         # 🔥 Smoothing
#         self.prev_x = 0
#         self.prev_y = 0

#         # 🔥 Stability counters
#         self.direction_counter = {
#             "LEFT": 0,
#             "RIGHT": 0,
#             "DOWN": 0,
#             "EYE_LEFT": 0,
#             "EYE_RIGHT": 0
#         }

#         self.last_violation_time = 0

#     # ================= HEAD POSE =================
#     def get_head_pose(self, frame, face_landmarks):
#         h, w, _ = frame.shape

#         face_2d = []
#         face_3d = []

#         for idx, lm in enumerate(face_landmarks.landmark):
#             if idx in [33, 263, 1, 61, 291, 199]:
#                 x, y = int(lm.x * w), int(lm.y * h)

#                 face_2d.append([x, y])
#                 face_3d.append([lm.x * w, lm.y * h, lm.z * 3000])

#         face_2d = np.array(face_2d, dtype=np.float64)
#         face_3d = np.array(face_3d, dtype=np.float64)

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

#         return angles  # x, y, z

#     # ================= EYE GAZE =================
#     def get_eye_gaze(self, face_landmarks, w, h):

#         # Left eye landmarks
#         left_eye = [33, 133]
#         left_iris = [468]

#         # Right eye landmarks
#         right_eye = [362, 263]
#         right_iris = [473]

#         # Get coordinates
#         lx1 = face_landmarks.landmark[left_eye[0]].x * w
#         lx2 = face_landmarks.landmark[left_eye[1]].x * w
#         li = face_landmarks.landmark[left_iris[0]].x * w

#         rx1 = face_landmarks.landmark[right_eye[0]].x * w
#         rx2 = face_landmarks.landmark[right_eye[1]].x * w
#         ri = face_landmarks.landmark[right_iris[0]].x * w

#         # Normalize (0 → left, 1 → right)
#         left_ratio = (li - lx1) / (lx2 - lx1 + 1e-6)
#         right_ratio = (ri - rx1) / (rx2 - rx1 + 1e-6)

#         gaze = (left_ratio + right_ratio) / 2

#         return gaze

#     # ================= MAIN =================
#     def process_frame(self, frame):

#         violations = []
#         h, w, _ = frame.shape

#         rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

#         # 📱 PHONE DETECTION
#         results = model(frame, verbose=False)

#         for r in results:
#             if r.boxes is None:
#                 continue

#             for box in r.boxes:
#                 cls = int(box.cls.item())
#                 conf = float(box.conf.item())

#                 if cls == 67 and conf > 0.3:
#                     violations.append("MOBILE_PHONE_DETECTED")

#         # 👤 FACE DETECTION
#         res = self.face_detection.process(rgb)
#         face_count = len(res.detections) if res.detections else 0

#         if face_count == 0:
#             self.no_face_counter += 1
#         else:
#             self.no_face_counter = 0

#         if self.no_face_counter > 5:
#             violations.append("NO_FACE_DETECTED")

#         if face_count > 1:
#             violations.append("MULTIPLE_FACES_DETECTED")

#         # 🧠 FACE MESH
#         mesh_results = self.face_mesh.process(rgb)

#         if mesh_results.multi_face_landmarks:

#             face_landmarks = mesh_results.multi_face_landmarks[0]

#             x, y, z = self.get_head_pose(frame, face_landmarks)

#             # 🔥 CALIBRATION
#             if not self.calibrated:
#                 self.calibration_frames.append((x, y))

#                 if len(self.calibration_frames) >= 20:
#                     xs = [p[0] for p in self.calibration_frames]
#                     ys = [p[1] for p in self.calibration_frames]

#                     self.base_x = sum(xs) / len(xs)
#                     self.base_y = sum(ys) / len(ys)

#                     self.calibrated = True
#                     print("✅ Calibration Done")

#                 return []

#             # 🔥 NORMALIZE
#             x -= self.base_x
#             y -= self.base_y

#             # 🔥 SMOOTHING
#             x = 0.7 * self.prev_x + 0.3 * x
#             y = 0.7 * self.prev_y + 0.3 * y

#             self.prev_x = x
#             self.prev_y = y

#             # 🔥 DEAD ZONE
#             if abs(x) < 8:
#                 x = 0
#             if abs(y) < 8:
#                 y = 0

#             # ================= HEAD =================
#             ANGLE = 10
#             FRAMES = 5

#             if y > ANGLE:
#                 self.direction_counter["RIGHT"] += 1
#             else:
#                 self.direction_counter["RIGHT"] = 0

#             if y < -ANGLE:
#                 self.direction_counter["LEFT"] += 1
#             else:
#                 self.direction_counter["LEFT"] = 0

#             if x > ANGLE:
#                 self.direction_counter["DOWN"] += 1
#             else:
#                 self.direction_counter["DOWN"] = 0

#             # ================= EYE =================
#             gaze = self.get_eye_gaze(face_landmarks, w, h)

#             if gaze > 0.65:
#                 self.direction_counter["EYE_RIGHT"] += 1
#             else:
#                 self.direction_counter["EYE_RIGHT"] = 0

#             if gaze < 0.35:
#                 self.direction_counter["EYE_LEFT"] += 1
#             else:
#                 self.direction_counter["EYE_LEFT"] = 0

#             # ================= VIOLATIONS =================
#             current_time = time.time()

#             def allow():
#                 return current_time - self.last_violation_time > 2

#             if self.direction_counter["RIGHT"] > FRAMES and allow():
#                 violations.append("LOOKING_RIGHT")
#                 self.last_violation_time = current_time

#             if self.direction_counter["LEFT"] > FRAMES and allow():
#                 violations.append("LOOKING_LEFT")
#                 self.last_violation_time = current_time

#             if self.direction_counter["DOWN"] > FRAMES and allow():
#                 violations.append("LOOKING_DOWN")
#                 self.last_violation_time = current_time

#             if self.direction_counter["EYE_RIGHT"] > FRAMES and allow():
#                 violations.append("EYE_LOOKING_RIGHT")
#                 self.last_violation_time = current_time

#             if self.direction_counter["EYE_LEFT"] > FRAMES and allow():
#                 violations.append("EYE_LOOKING_LEFT")
#                 self.last_violation_time = current_time

#         if violations:
#             print("🚨 VIOLATIONS:", violations)
#         return violations

import cv2
import mediapipe as mp
from ultralytics import YOLO
import numpy as np
import time

MODEL_PATH = r"C:\models\yolov8n.pt"
model = YOLO(MODEL_PATH)

mp_face_detection = mp.solutions.face_detection
mp_face_mesh = mp.solutions.face_mesh


class AIEngine:
    def __init__(self):
        self.face_detection = mp_face_detection.FaceDetection(0, 0.5)

        self.face_mesh = mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

        self.no_face_counter = 0

        # ================= CALIBRATION =================
        self.calibrated = False
        self.calibration_frames = []
        self.base_x = 0
        self.base_y = 0

        self.gaze_history = []
        self.gaze_center = 0.5

        # ================= SMOOTHING =================
        self.prev_x = 0
        self.prev_y = 0
        self.prev_gaze = 0.5

        # ================= TIME TRACKING =================
        self.direction_time = {
            "LEFT": 0,
            "RIGHT": 0,
            "DOWN": 0,
            "EYE_LEFT": 0,
            "EYE_RIGHT": 0
        }

        self.last_time = time.time()
        self.last_violation_time = 0

    # ================= HEAD POSE =================
    def get_head_pose(self, frame, face_landmarks):
        h, w, _ = frame.shape

        face_2d, face_3d = [], []

        for idx, lm in enumerate(face_landmarks.landmark):
            if idx in [33, 263, 1, 61, 291, 199]:
                x, y = int(lm.x * w), int(lm.y * h)
                face_2d.append([x, y])
                face_3d.append([lm.x * w, lm.y * h, lm.z * 3000])

        face_2d = np.array(face_2d, dtype=np.float64)
        face_3d = np.array(face_3d, dtype=np.float64)

        focal_length = w
        cam_matrix = np.array([
            [focal_length, 0, w / 2],
            [0, focal_length, h / 2],
            [0, 0, 1]
        ])

        dist_matrix = np.zeros((4, 1), dtype=np.float64)

        _, rot_vec, _ = cv2.solvePnP(face_3d, face_2d, cam_matrix, dist_matrix)
        rmat, _ = cv2.Rodrigues(rot_vec)
        angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)

        return angles  # x, y, z

    # ================= EYE GAZE =================
    def get_eye_gaze(self, face_landmarks, w):
        left_eye = [33, 133]
        left_iris = 468

        right_eye = [362, 263]
        right_iris = 473

        lx1 = face_landmarks.landmark[left_eye[0]].x * w
        lx2 = face_landmarks.landmark[left_eye[1]].x * w
        li = face_landmarks.landmark[left_iris].x * w

        rx1 = face_landmarks.landmark[right_eye[0]].x * w
        rx2 = face_landmarks.landmark[right_eye[1]].x * w
        ri = face_landmarks.landmark[right_iris].x * w

        left_ratio = (li - lx1) / (lx2 - lx1 + 1e-6)
        right_ratio = (ri - rx1) / (rx2 - rx1 + 1e-6)

        return (left_ratio + right_ratio) / 2

    # ================= MAIN =================
    def process_frame(self, frame):

        violations = []
        h, w, _ = frame.shape
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # ================= TIME DELTA =================
        current_time = time.time()
        dt = current_time - self.last_time
        self.last_time = current_time

        # ================= PHONE =================
        results = model(frame, verbose=False)

        for r in results:
            if r.boxes:
                for box in r.boxes:
                    if int(box.cls.item()) == 67 and float(box.conf.item()) > 0.3:
                        violations.append("MOBILE_PHONE_DETECTED")

        # ================= FACE =================
        res = self.face_detection.process(rgb)
        face_count = len(res.detections) if res.detections else 0

        if face_count == 0:
            self.no_face_counter += 1
        else:
            self.no_face_counter = 0

        if self.no_face_counter > 5:
            violations.append("NO_FACE_DETECTED")

        if face_count > 1:
            violations.append("MULTIPLE_FACES_DETECTED")

        # ================= FACE MESH =================
        mesh = self.face_mesh.process(rgb)

        if not mesh.multi_face_landmarks:
            return violations

        face_landmarks = mesh.multi_face_landmarks[0]

        # ================= HEAD =================
        x, y, _ = self.get_head_pose(frame, face_landmarks)

        # ================= GAZE =================
        gaze = self.get_eye_gaze(face_landmarks, w)

        # ================= CALIBRATION =================
        if not self.calibrated:
            self.calibration_frames.append((x, y))
            self.gaze_history.append(gaze)

            if len(self.calibration_frames) >= 25:
                self.base_x = np.mean([p[0] for p in self.calibration_frames])
                self.base_y = np.mean([p[1] for p in self.calibration_frames])
                self.gaze_center = np.mean(self.gaze_history)
                self.calibrated = True
                print("✅ Calibration Complete")

            return []

        # ================= NORMALIZE =================
        x -= self.base_x
        y -= self.base_y

        # ================= SMOOTH =================
        x = 0.7 * self.prev_x + 0.3 * x
        y = 0.7 * self.prev_y + 0.3 * y
        gaze = 0.7 * self.prev_gaze + 0.3 * gaze

        self.prev_x, self.prev_y, self.prev_gaze = x, y, gaze

        # ================= DEAD ZONE =================
        if abs(x) < 8: x = 0
        if abs(y) < 8: y = 0

        # ================= DYNAMIC GAZE =================
        LEFT_EYE = self.gaze_center - 0.18
        RIGHT_EYE = self.gaze_center + 0.18

        # ================= TIME TRACK =================
        def update(key, condition):
            if condition:
                self.direction_time[key] += dt
            else:
                self.direction_time[key] = 0

        update("RIGHT", y > 12)
        update("LEFT", y < -12)
        update("DOWN", x > 12)
        update("EYE_RIGHT", gaze > RIGHT_EYE)
        update("EYE_LEFT", gaze < LEFT_EYE)

        # ================= FUSION LOGIC =================
        def allow():
            return time.time() - self.last_violation_time > 2

        if (self.direction_time["RIGHT"] > 1.0 and
            self.direction_time["EYE_RIGHT"] > 0.8 and allow()):
            violations.append("STRONG_RIGHT_LOOK")
            self.last_violation_time = time.time()

        if (self.direction_time["LEFT"] > 1.0 and
            self.direction_time["EYE_LEFT"] > 0.8 and allow()):
            violations.append("STRONG_LEFT_LOOK")
            self.last_violation_time = time.time()

        if self.direction_time["DOWN"] > 1.2 and allow():
            violations.append("LOOKING_DOWN")
            self.last_violation_time = time.time()

        # ================= PRINT =================
        if violations:
            print(f"[{time.strftime('%H:%M:%S')}] 🚨 {', '.join(violations)}")

        return violations