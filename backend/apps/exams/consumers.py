
# from channels.generic.websocket import AsyncWebsocketConsumer 
# import json 
# from urllib.parse import parse_qs 
# class ProctoringConsumer(AsyncWebsocketConsumer): 

#     async def connect(self): 
#         self.exam_id = self.scope["url_route"]["kwargs"]["exam_id"] 
#         query = parse_qs(self.scope["query_string"].decode()) 
#         self.role = query.get("role", ["student"])[0] 

#         # Only student has student_id 
#         self.student_id = self.scope["url_route"]["kwargs"].get("student_id") 

#         # ONE exam group for everyone 
#         self.exam_group = f"exam_{self.exam_id}" 
#         await self.channel_layer.group_add( 
#             self.exam_group, 
#             self.channel_name 
#         ) 
#         await self.accept() 
        
#         print(f"{self.role.upper()} CONNECTED") 

#     async def disconnect(self, close_code): 
#         await self.channel_layer.group_discard( 
#             self.exam_group, 
#             self.channel_name 
#         ) 
#         print(f"{self.role.upper()} DISCONNECTED") 
    
#     async def receive(self, text_data):
#         data = json.loads(text_data)

#         # If student, attach studentId automatically
#         if self.role == "student":
#             data["studentId"] = self.student_id

#         # Broadcast EVERYTHING to exam group
#         await self.channel_layer.group_send(
#             self.exam_group,
#             {
#                 "type": "signal_message",
#                 "message": data
#             }
#         )
        
#     async def signal_message(self, event): 
#         await self.send(text_data=json.dumps(event["message"]))

from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ProctoringConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.exam_id = self.scope["url_route"]["kwargs"]["exam_id"]
        self.student_id = self.scope["url_route"]["kwargs"].get("student_id")

        self.role = "student" if self.student_id else "admin"
        self.group_name = f"exam_{self.exam_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

        print(f"✅ {self.role.upper()} CONNECTED | student={self.student_id}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        print(f"❌ {self.role.upper()} DISCONNECTED")

    async def receive(self, text_data):
        data = json.loads(text_data)

        # attach studentId automatically
        if self.role == "student":
            data["studentId"] = self.student_id

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "signal",
                "message": data
            }
        )

    async def signal(self, event):
        await self.send(text_data=json.dumps(event["message"]))