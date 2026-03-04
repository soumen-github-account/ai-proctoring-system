# from django.urls import re_path
# from .consumers import ProctoringConsumer

# websocket_urlpatterns = [
#     re_path(r'ws/proctor/(?P<exam_id>\w+)/$', ProctoringConsumer.as_asgi()),
# ]

# from django.urls import re_path
# from .consumers import ProctoringConsumer

# websocket_urlpatterns = [
#     re_path(
#         r"ws/proctoring/(?P<exam_id>\d+)/(?P<student_id>\d+)/$",
#         ProctoringConsumer.as_asgi()
#     ),

#     re_path(
#         r"ws/proctoring/(?P<exam_id>\d+)/$",
#         ProctoringConsumer.as_asgi()
#     ),
# ]

from django.urls import re_path
from .consumers import ProctoringConsumer

websocket_urlpatterns = [
    re_path(
        r"ws/proctoring/student/(?P<exam_id>\d+)/(?P<student_id>\d+)/$",
        ProctoringConsumer.as_asgi(),
    ),
    re_path(
        r"ws/proctoring/admin/(?P<exam_id>\d+)/$",
        ProctoringConsumer.as_asgi(),
    ),
]