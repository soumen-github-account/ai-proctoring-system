
import os
import cv2
from django.conf import settings
import cloudinary.uploader

import asyncio
import time
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaRelay
from channels.layers import get_channel_layer
from .ai_engine import AIEngine

from apps.exams.services import save_violation
from asgiref.sync import sync_to_async

relay = MediaRelay()
student_tracks = {}

class VideoProcessor:

    def __init__(self, exam_id, student_id):

        self.exam_id = exam_id
        self.student_id = str(student_id)
        self.ai = AIEngine()
        self.channel_layer = get_channel_layer()
        self.last_violation_time = {}
        print("🎯 VIDEO PROCESSOR CREATED:", exam_id, student_id)

    async def handle_offer(self, offer):

        pc = RTCPeerConnection()

        @pc.on("track")
        async def on_track(track):

            print("🎥 TRACK RECEIVED:", track.kind)

            if track.kind == "video":

                # student_tracks[self.student_id] = relay.subscribe(track)
                student_tracks[self.student_id] = track

                print("📡 STORED VIDEO FOR:", self.student_id)
                

                # notify admin
                await self.channel_layer.group_send(
                    f"exam_{self.exam_id}",
                    {
                        "type": "signal",
                        "message": {
                            "type": "student-ready",
                            "studentId": self.student_id
                        }
                    }
                )

                # asyncio.create_task(self.process_video(track))
                asyncio.create_task(self.process_video(relay.subscribe(track)))

        await pc.setRemoteDescription(
            RTCSessionDescription(
                sdp=offer["sdp"],
                type=offer["type"]
            )
        )

        answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)

        return {
            "sdp": pc.localDescription.sdp,
            "type": pc.localDescription.type
        }

    async def process_video(self, track):

        frame_count = 0

        while True:

            try:
                frame = await track.recv()
            except:
                break

            frame_count += 1

            # reduce AI load
            if frame_count % 10 != 0:
                continue

            try:
                img = frame.to_ndarray(format="bgr24")
            except:
                continue

            violations = self.ai.process_frame(img)

            for v in violations:

                now = time.time()

                if v in self.last_violation_time:
                    if now - self.last_violation_time[v] < 5:
                        continue

                self.last_violation_time[v] = now

                print("🚨 VIOLATION:", v)

                # filename = f"{self.student_id}_{int(time.time())}.jpg"

                # os.makedirs(os.path.join(settings.MEDIA_ROOT, "violations"), exist_ok=True)

                # path = os.path.join(settings.MEDIA_ROOT, "violations", filename)

                # cv2.imwrite(path, img)

                # screenshot_path = f"violations/{filename}"
                _, buffer = cv2.imencode(".jpg", img)

                upload_result = cloudinary.uploader.upload(
                    buffer.tobytes(),
                    folder="ai_proctoring_violations"
                )

                screenshot_url = upload_result["secure_url"]

                await sync_to_async(save_violation)(
                    self.exam_id,
                    self.student_id,
                    v,
                    screenshot_url
                )

                await self.channel_layer.group_send(
                    f"exam_{self.exam_id}",
                    {
                        "type": "signal",
                        "message": {
                            "type": "violation",
                            "studentId": self.student_id,
                            "violation": v,
                            "timestamp": time.time(),
                            "image": screenshot_url
                        }
                    }
                )