# from aiortc import RTCPeerConnection, RTCSessionDescription
# from .ai_engine import AIEngine
# from channels.layers import get_channel_layer
# pcs = set()


# class VideoProcessor:

#     def __init__(self, send_violation_callback):
#         self.ai = AIEngine()
#         self.send_violation = send_violation_callback

#     async def handle_offer(self, offer):

#         pc = RTCPeerConnection()
#         pcs.add(pc)

#         @pc.on("track")
#         async def on_track(track):

#             print("🎥 Video track received")

#             frame_count = 0

#             while True:
#                 frame = await track.recv()
#                 frame_count += 1

#                 # Process every 5th frame (performance)
#                 if frame_count % 5 != 0:
#                     continue

#                 img = frame.to_ndarray(format="bgr24")

#                 # violations = self.ai.process_frame(img)

#                 # for violation in violations:
#                 #     await self.send_violation(violation)
#                 channel_layer = get_channel_layer()

#                 violations = self.ai.process_frame(img)

#                 for violation in violations:
#                     print("🚨 VIOLATION DETECTED:", violation)

#                     await channel_layer.group_send(
#                         f"exam_{self.exam_id}",
#                         {
#                             "type": "signal_message",
#                             "message": {
#                                 "type": "violation",
#                                 "studentId": self.student_id,
#                                 "violation": violation
#                             }
#                         }
#                     )

#         await pc.setRemoteDescription(
#             RTCSessionDescription(
#                 sdp=offer["sdp"],
#                 type=offer["type"]
#             )
#         )

#         answer = await pc.createAnswer()
#         await pc.setLocalDescription(answer)

#         return {
#             "sdp": pc.localDescription.sdp,
#             "type": pc.localDescription.type,
#         }

from aiortc import RTCPeerConnection, RTCSessionDescription
from .ai_engine import AIEngine
from channels.layers import get_channel_layer

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

            print("🎥 Video track received")

            frame_count = 0

            try:
                while True:
                    frame = await track.recv()
                    frame_count += 1

                    if frame_count % 5 != 0:
                        continue

                    img = frame.to_ndarray(format="bgr24")

                    violations = self.ai.process_frame(img)

                    for violation in violations:
                        print("🚨 VIOLATION DETECTED:", violation)

                        # await self.channel_layer.group_send(
                        #     f"exam_{self.exam_id}",
                        #     {
                        #         "type": "signal_message",
                        #         "message": {
                        #             "type": "violation",
                        #             "studentId": self.student_id,
                        #             "violation": violation
                        #         }
                        #     }
                        # )
                        await self.channel_layer.group_send(
                            f"exam_{self.exam_id}",
                            {
                                "type": "signal_message",
                                "message": {
                                    "type": "violation",
                                    "studentId": self.student_id,
                                    "violation": violation,
                                    "timestamp": time.time()
                                }
                            }
                        )

            except Exception as e:
                print("Track ended:", e)

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
            "type": pc.localDescription.type,
        }

