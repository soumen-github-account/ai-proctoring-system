from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Exam, Question, ExamAttempt, Attempt, Violation
from .serializer import ExamSerializer, SubmitExamSerializer
from django.http import HttpResponse
from apps.users.models import User
from bson import ObjectId, errors as bson_errors
from datetime import datetime
from dateutil import parser

# for generate pdf
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO

import cloudinary
import cloudinary.uploader
from django.conf import settings


class CreateExam(APIView):
    def post(self, request):
        data = request.data

        exam = Exam(
            name=data['name'],
            subject=data['subject'],
            duration=int(data['duration'])
        ).save()

        return Response({
            "success": True,
            "exam_id": str(exam.id),
            "message": "Exam created successfully"
        })

class UpdateExam(APIView):
    def put(self, request, exam_id):
        try:
            data = request.data
            exam = Exam.objects(id=exam_id).first()
            if not exam:
                return Response({
                    "success": False,
                    "message": "Exam not found"
                })
            
            exam.name = data.get("name", exam.name)
            exam.subject = data.get("subject", exam.subject)
            exam.duration = int(data.get("duration", exam.duration))

            exam.save()

            return Response({
                "success": True,
                "message": "Exam updated successfully"
            })
        
        except Exception as e:
            return Response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class DeleteExam(APIView):
    def delete(self, request, exam_id):
        try:
            exam = Exam.objects(id=exam_id).first()

            if not exam:
                return Response({
                    "success": False,
                    "message": "Exam not found"
                }, status=status.HTTP_404_NOT_FOUND)

            exam.delete()

            return Response({
                "success": True,
                "message": "Exam deleted successfully"
            })

        except Exception as e:
            return Response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class AddQuestion(APIView):
    def post(self, request):
        data = request.data

        exam = Exam.objects(id=data['exam_id']).first()

        if not exam:
            return Response({"success": False, "message": "Exam not found"})

        question = Question(
            exam=exam,
            question_text=data['question_text'],
            options=data['options'],
            correct_answer=data['correct_answer']
        ).save()

        # Update total question count
        exam.total_questions = Question.objects(exam=exam).count()
        exam.save()

        return Response({"success": True, "message": "Question added"})
 
class DeleteQuestion(APIView):
    def delete(self, request, question_id):

        question = Question.objects(id=question_id).first()

        if not question:
            return Response({"success": False, "message": "Question Not found."})
    
        exam = question.exam

        
        question.delete()

        exam.total_questions = Question.objects(exam=exam).count()
        exam.save()

        return Response({"success": True, "message": "Question Deleted"})

class GetQuestions(APIView):
    def get(self, request, exam_id):

        questions = Question.objects(exam=exam_id)

        question_list = []

        for q in questions:
            question_list.append({
                "id": str(q.id),
                "question_text": q.question_text,
                "options": q.options,
                "correct_answer": q.correct_answer
            })

        return Response({
            "success": True,
            "questions": question_list
        })

class GetExams(APIView):
    def get(self, request):
        exams = Exam.objects().order_by('-created_at')

        exam_list = []
        for exam in exams:
            exam_list.append({
                "id": str(exam.id),
                "name": exam.name,
                "subject": exam.subject,
                "duration": exam.duration,
                "total_questions": exam.total_questions,
                "is_published": exam.is_published
            })

        return Response({
            "success": True,
            "exams": exam_list
        })

class GetFirstExam(APIView):

    def get(self, request):
        exam = Exam.objects.order_by('created_at').first()

        if not exam:
            return Response({"success": False, "error": "No exams found"}, status=404)

        return Response({
            "success": True,
            "exam": ExamSerializer(exam).data
        })

class AddViolation(APIView):

    def post(self, request):

        student_id = request.data.get("student")
        exam_id = request.data.get("exam")
        violation_type = request.data.get("type")
        screenshot = request.data.get("screenshot")

        try:

            student = User.objects(id=student_id).first()
            exam = Exam.objects(id=exam_id).first()

            if not student or not exam:
                return Response({
                    "success": False,
                    "message": "Student or Exam not found"
                })

            # find exam attempt
            attempt = ExamAttempt.objects(student=student, exam=exam).first()

            if not attempt:

                attempt = ExamAttempt(
                    student=student,
                    exam=exam,
                    started_at=datetime.utcnow(),
                    violations=[]
                )
                attempt.save()

            screenshot_url = None

            # upload screenshot to cloudinary
            if screenshot:

                upload = cloudinary.uploader.upload(
                    screenshot,
                    folder="ai-proctoring/screenshots"
                )

                screenshot_url = upload.get("secure_url")

            # find existing violation type
            existing = None

            for v in attempt.violations:
                if v.type == violation_type:
                    existing = v
                    break

            if existing:

                existing.count += 1

                if screenshot_url:
                    existing.screenshots.append(screenshot_url)

            else:

                violation = Violation(
                    type=violation_type,
                    count=1,
                    screenshots=[screenshot_url] if screenshot_url else []
                )

                attempt.violations.append(violation)

            attempt.save()

            return Response({
                "success": True,
                "message": "Violation recorded"
            })

        except Exception as e:

            return Response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# def calculate_risk(total_violations):
#     if total_violations >= 8:
#         return "CRITICAL"
#     elif total_violations >= 5:
#         return "HIGH"
#     elif total_violations >= 2:
#         return "MEDIUM"
#     return "LOW"



# class SubmitExamView(APIView):

#     def post(self, request):
#         try:
#             student_id = request.data.get("student")
#             exam_id = request.data.get("exam")
#             score = request.data.get("score")
#             violations_data = request.data.get("violations", [])
#             recording = request.data.get("recording", False)

#             student = User.objects(id=ObjectId(student_id)).first()
#             exam = Exam.objects(id=ObjectId(exam_id)).first()

#             if not student or not exam:
#                 return Response({"error": "Student or Exam not found"}, status=404)

#             violation_objects = []

#             for v in violations_data:
#                 violation_objects.append(
#                     Violation(
#                         type=v.get("type"),
#                         screenshot=v.get("screenshot"),
#                         timestamp=parser.parse(v.get("timestamp")) if v.get("timestamp") else datetime.utcnow()
#                     )
#                 )

#             violation_count = len(violation_objects)

#             attempt = Attempt(
#                 status="Completed",
#                 score=score,
#                 violations_count=violation_count,
#                 recording=recording,
#                 risk=calculate_risk(violation_count)
#             )

#             exam_attempt = ExamAttempt(
#                 student=student,
#                 exam=exam,
#                 attempt=attempt,
#                 violations=violation_objects
#             )

#             exam_attempt.save()

#             return Response({
#                 "success": True,
#                 "risk": attempt.risk,
#                 "violations": violation_count
#             })

#         except Exception as e:
#             return Response({"success": False, "error": str(e)}, status=500)


# class AddViolationView(APIView):

#     def post(self, request):
#         try:
#             student_id = request.data.get("student")
#             exam_id = request.data.get("exam")
#             message = request.data.get("message")
#             screenshot = request.data.get("screenshot")

#             if not student_id or not exam_id or not message:
#                 return Response({"error": "Missing required fields"}, status=400)

#             student = User.objects(id=ObjectId(student_id)).first()
#             exam = Exam.objects(id=ObjectId(exam_id)).first()

#             if not student or not exam:
#                 return Response({"error": "Student or Exam not found"}, status=404)

#             attempt = ExamAttempt.objects(student=student, exam=exam).first()

#             if not attempt:
#                 return Response({"error": "Attempt not found"}, status=404)

#             violation = Violation(
#                 type=message,
#                 screenshot=screenshot,
#                 timestamp=datetime.utcnow()
#             )

#             attempt.violations.append(violation)

#             violation_count = len(attempt.violations)

#             attempt.attempt.violations_count = violation_count
#             attempt.attempt.risk = calculate_risk(violation_count)

#             attempt.save()

#             return Response({
#                 "success": True,
#                 "violations_count": violation_count,
#                 "risk": attempt.attempt.risk
#             })

#         except Exception as e:
#             return Response({"error": str(e)}, status=500)