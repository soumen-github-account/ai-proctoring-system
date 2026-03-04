from django.urls import path
from .views import add_student, student_login, get_students, delete_student, update_student

urlpatterns = [
    path('student-login/', student_login.as_view()),
    path('add-student/', add_student.as_view()),
    path('students/', get_students.as_view()),
    path('update-student/<str:student_id>/', update_student.as_view()),
    path('delete-student/<str:student_id>/', delete_student.as_view())
]
