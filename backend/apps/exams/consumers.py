
# consumer.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json, time
from .webrtc_handler import VideoProcessor

LATEST_VIOLATIONS = {}

class ProctoringConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.exam_id = self.scope["url_route"]["kwargs"]["exam_id"]
        self.student_id = self.scope["url_route"]["kwargs"].get("student_id")
        self.role = "student" if self.student_id else "admin"
        self.group_name = f"exam_{self.exam_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        print(f"✅ {self.role.upper()} CONNECTED")

        if self.role == "admin":
            for sid, logs in LATEST_VIOLATIONS.items():
                for v in logs[-3:]:
                    await self.send(text_data=json.dumps({
                        "type": "violation",
                        "studentId": sid,
                        "violation": v["violation"],
                        "timestamp": v["timestamp"]
                    }))

    async def receive(self, text_data):
        data = json.loads(text_data)

        if self.role == "student":
            data["studentId"] = self.student_id

        # ===== HANDLE OFFER (START AI PROCESSOR) =====
        if data.get("type") == "offer" and self.role == "student":
            print("📩 OFFER RECEIVED FROM STUDENT")

            processor = VideoProcessor(self.exam_id, self.student_id)

            answer = await processor.handle_offer(data["offer"])

            await self.send(text_data=json.dumps({
                "type": "answer",
                "answer": answer,
                "studentId": self.student_id
            }))

            return

        # ===== STORE VIOLATIONS =====
        if data.get("type") == "violation":
            sid = str(data["studentId"])
            LATEST_VIOLATIONS.setdefault(sid, []).append({
                "violation": data["violation"],
                "timestamp": data.get("timestamp", time.time())
            })
            LATEST_VIOLATIONS[sid] = LATEST_VIOLATIONS[sid][-10:]

        # ===== BROADCAST =====
        await self.channel_layer.group_send(
            self.group_name,
            {"type": "signal", "message": data}
        )

    
    async def signal(self, event):
        await self.send(text_data = json.dumps(event["message"]))
         