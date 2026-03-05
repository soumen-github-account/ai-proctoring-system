
# video_processor.py
import time
from aiortc import RTCPeerConnection, RTCSessionDescription
from channels.layers import get_channel_layer
from .ai_engine import AIEngine

pcs = set()

class VideoProcessor:
    def __init__(self, exam_id, student_id):
        self.exam_id = exam_id
        self.student_id = student_id
        self.ai = AIEngine()
        self.channel_layer = get_channel_layer()

    async def handle_offer(self, offer):
        pc = RTCPeerConnection()
        pcs.add(pc)

        @pc.on("track")
        async def on_track(track):
            print("🎯 TRACK RECEIVED:", track.kind)

            while True:
                frame = await track.recv()
                img = frame.to_ndarray(format="bgr24")
                # frame = await track.recv()
                # img = frame.to_ndarray()
                # img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

                violations = self.ai.process_frame(img)

                for v in violations:
                    print("🚨 VIOLATION:", v)
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