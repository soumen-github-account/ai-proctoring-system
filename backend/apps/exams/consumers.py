

# import json
# from channels.generic.websocket import AsyncWebsocketConsumer
# from aiortc import RTCPeerConnection, RTCSessionDescription
# from .webrtc_handler import VideoProcessor, student_tracks
# from aiortc.contrib.media import MediaRelay

# LATEST_VIOLATIONS = {}
# relay = MediaRelay()

# class ProctoringConsumer(AsyncWebsocketConsumer):

#     async def connect(self):

#         self.exam_id = self.scope["url_route"]["kwargs"].get("exam_id")
#         self.student_id = self.scope["url_route"]["kwargs"].get("student_id")
        
#         self.role = "student" if self.student_id else "admin"

#         self.group_name = f"exam_{self.exam_id}"

#         self.peers = {}
#         print("🎯 CONNECTED:", self.exam_id, self.student_id)

#         await self.channel_layer.group_add(self.group_name, self.channel_name)
#         await self.accept()

#         print(f"✅ {self.role} connected")

#         # IMPORTANT: send existing students to admin
#         if self.role == "admin":

#             for sid in student_tracks.keys():

#                 await self.send(text_data=json.dumps({
#                     "type": "student-ready",
#                     "studentId": sid
#                 }))

#     async def receive(self, text_data):

#         data = json.loads(text_data)

#         msg_type = data.get("type")

#         if msg_type == "offer" and self.role == "student":

#             processor = VideoProcessor(self.exam_id, self.student_id)

#             answer = await processor.handle_offer(data["offer"])

#             await self.send(text_data=json.dumps({
#                 "type": "answer",
#                 "answer": answer
#             }))

            
#         if msg_type == "answer" and self.role == "admin":

#             student_id = str(data["studentId"])

#             pc = self.peers.get(student_id)

#             if pc:

#                 await pc.setRemoteDescription(
#                     RTCSessionDescription(
#                         sdp=data["answer"]["sdp"],
#                         type=data["answer"]["type"]
#                     )
#                 )

#         if msg_type == "watch-student" and self.role == "admin":

#             student_id = str(data["studentId"])

#             if student_id not in student_tracks:
#                 print("❌ No track for", student_id)
#                 return

#             # close old peer
#             if student_id in self.peers:
#                 try:
#                     await self.peers[student_id].close()
#                 except:
#                     pass

#             pc = RTCPeerConnection()

#             self.peers[student_id] = pc

#             print("🎥 SENDING TRACK TO ADMIN:", student_id)

#             @pc.on("icecandidate")
#             async def on_icecandidate(candidate):

#                 if candidate:

#                     await self.send(text_data=json.dumps({
#                         "type": "ice-candidate",
#                         "studentId": student_id,
#                         "candidate": candidate
#                     }))

#             # pc.addTrack(student_tracks[student_id])

#             pc.addTrack(relay.subscribe(student_tracks[student_id]))

#             offer = await pc.createOffer()
#             await pc.setLocalDescription(offer)

#             await self.send(text_data=json.dumps({
#                 "type": "offer",
#                 "studentId": student_id,
#                 "offer": {
#                     "sdp": pc.localDescription.sdp,
#                     "type": pc.localDescription.type
#                 }
#             }))
#     async def signal(self, event):

#         data = event["message"]
#         print("📡 SENDING TO ADMIN:", data)

#         if data.get("type") == "violation":

#             sid = str(data["studentId"])

#             LATEST_VIOLATIONS.setdefault(sid, []).append({
#                 "violation": data["violation"],
#                 "timestamp": data["timestamp"]
#             })

#             LATEST_VIOLATIONS[sid] = LATEST_VIOLATIONS[sid][-10:]

#         await self.send(text_data=json.dumps(data))

#     async def disconnect(self, close_code):

#         for pc in self.peers.values():
#             try:
#                 await pc.close()
#             except:
#                 pass

#         self.peers.clear()

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from aiortc import RTCPeerConnection, RTCSessionDescription
# CRITICAL: import the SAME relay instance from webrtc_handler — never create a new one here
from .webrtc_handler import VideoProcessor, student_tracks, relay

LATEST_VIOLATIONS = {}


class ProctoringConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.exam_id = self.scope["url_route"]["kwargs"].get("exam_id")
        self.student_id = self.scope["url_route"]["kwargs"].get("student_id")

        self.role = "student" if self.student_id else "admin"
        self.group_name = f"exam_{self.exam_id}"

        # peer connections keyed by student_id — kept alive here so GC can't drop them
        self.peers = {}

        print("🎯 CONNECTED:", self.exam_id, self.student_id, "| role:", self.role)

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        print(f"✅ {self.role} connected")

        # When a new admin connects, tell it about every student already streaming
        if self.role == "admin":
            for key in list(student_tracks.keys()):
                # Skip internal _pc_ entries — they are RTCPeerConnection objects, not tracks
                if key.startswith("_pc_"):
                    continue
                await self.send(text_data=json.dumps({
                    "type": "student-ready",
                    "studentId": key,
                }))

    async def receive(self, text_data):
        data = json.loads(text_data)
        msg_type = data.get("type")

        # ── Student sends offer ──────────────────────────────────────────────
        if msg_type == "offer" and self.role == "student":
            processor = VideoProcessor(self.exam_id, self.student_id)
            answer = await processor.handle_offer(data["offer"])
            await self.send(text_data=json.dumps({
                "type": "answer",
                "answer": answer,
            }))

        # ── Admin wants to watch a specific student ──────────────────────────
        if msg_type == "watch-student" and self.role == "admin":
            student_id = str(data["studentId"])

            if student_id not in student_tracks:
                print("❌ No track for", student_id)
                return

            # Close any previous peer for this student before making a new one
            if student_id in self.peers:
                try:
                    await self.peers[student_id].close()
                except Exception:
                    pass

            pc = RTCPeerConnection()

            # Keep the PC alive inside self.peers so it is never garbage-collected
            self.peers[student_id] = pc

            @pc.on("icecandidate")
            async def on_icecandidate(candidate):
                if candidate:
                    await self.send(text_data=json.dumps({
                        "type": "ice-candidate",
                        "studentId": student_id,
                        "candidate": {
                            "candidate": candidate.candidate,
                            "sdpMid": candidate.sdpMid,
                            "sdpMLineIndex": candidate.sdpMLineIndex,
                        },
                    }))

            # Subscribe a fresh relay slot — uses the SAME relay imported above
            pc.addTrack(relay.subscribe(student_tracks[student_id]))

            offer = await pc.createOffer()
            await pc.setLocalDescription(offer)

            await self.send(text_data=json.dumps({
                "type": "offer",
                "studentId": student_id,
                "offer": {
                    "sdp": pc.localDescription.sdp,
                    "type": pc.localDescription.type,
                },
            }))

        # ── Admin sends back its answer ──────────────────────────────────────
        if msg_type == "answer" and self.role == "admin":
            student_id = str(data["studentId"])
            pc = self.peers.get(student_id)
            if pc:
                await pc.setRemoteDescription(
                    RTCSessionDescription(
                        sdp=data["answer"]["sdp"],
                        type=data["answer"]["type"],
                    )
                )

        # ── Admin sends ICE candidates back to server ────────────────────────
        # (previously missing — caused connection failures for all but first student)
        if msg_type == "ice-candidate" and self.role == "admin":
            student_id = str(data.get("studentId", ""))
            pc = self.peers.get(student_id)
            if pc and data.get("candidate"):
                try:
                    from aiortc.sdp import candidate_from_sdp
                    raw = data["candidate"]
                    candidate_str = raw.get("candidate", "")
                    # Strip leading "candidate:" prefix if the browser included it
                    if candidate_str.startswith("candidate:"):
                        candidate_str = candidate_str[len("candidate:"):]
                    ice_candidate = candidate_from_sdp(candidate_str)
                    ice_candidate.sdpMid = raw.get("sdpMid")
                    ice_candidate.sdpMLineIndex = raw.get("sdpMLineIndex")
                    await pc.addIceCandidate(ice_candidate)
                except Exception as e:
                    print("ICE ADD ERROR:", e)

    # ── Channel-layer broadcast handler ─────────────────────────────────────
    async def signal(self, event):
        data = event["message"]
        print("📡 SENDING TO CLIENT:", data.get("type"), "| student:", data.get("studentId"))

        if data.get("type") == "violation":
            sid = str(data["studentId"])
            LATEST_VIOLATIONS.setdefault(sid, []).append({
                "violation": data["violation"],
                "timestamp": data["timestamp"],
            })
            # Keep only the last 10 violations per student in memory
            LATEST_VIOLATIONS[sid] = LATEST_VIOLATIONS[sid][-10:]

        await self.send(text_data=json.dumps(data))

    # ── Cleanup ──────────────────────────────────────────────────────────────
    async def disconnect(self, close_code):
        for pc in self.peers.values():
            try:
                await pc.close()
            except Exception:
                pass
        self.peers.clear()

        await self.channel_layer.group_discard(self.group_name, self.channel_name)