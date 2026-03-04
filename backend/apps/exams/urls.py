
from django.urls import path
from .views import CreateExam, AddQuestion, GetQuestions, GetExams, UpdateExam, DeleteExam, DeleteQuestion, GetFirstExam, SubmitExamView, AddViolationView

urlpatterns = [
    path('create/', CreateExam.as_view()),
    path('add-question/', AddQuestion.as_view()),
    path('questions/<str:exam_id>/', GetQuestions.as_view()),
    path("delete-question/<str:question_id>/", DeleteQuestion.as_view()),
    path('get-exams/', GetExams.as_view()),
    path("update-exam/<str:exam_id>/", UpdateExam.as_view()),
    path("delete-exam/<str:exam_id>/", DeleteExam.as_view()),
    path("get-first-exam/", GetFirstExam.as_view()),
    path("submit-exam/", SubmitExamView.as_view()),
    path("add-violation/", AddViolationView.as_view())
    
    
    # path('publish/<str:exam_id>/', PublishExam.as_view()),
]
