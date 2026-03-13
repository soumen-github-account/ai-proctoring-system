
import asyncio
import time
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaRelay
from channels.layers import get_channel_layer
from .ai_engine import AIEngine

relay = MediaRelay()
student_tracks = {}

class VideoProcessor:

    def __init__(self, exam_id, student_id):

        self.exam_id = exam_id
        self.student_id = str(student_id)
        self.ai = AIEngine()
        self.channel_layer = get_channel_layer()

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

            # print("AI RESULT:", violations)

            for v in violations:

                print("🚨 VIOLATION:", v)

                # SEND TO ADMIN
                await self.channel_layer.group_send(
                    f"exam_{self.exam_id}",
                    {
                        "type": "signal",
                        "message": {
                            "type": "violation",
                            "studentId": self.student_id,
                            "violation": v,
                            "timestamp": time.time()
                        }
                    }
                )