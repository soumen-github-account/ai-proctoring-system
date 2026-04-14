from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Exam, Question, ExamAttempt, Attempt, Violation, Answer
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

            # calculate updated risk
            violations = attempt.violations or []
            risk_score, violations_count, risk = calculate_risk(violations)

            if not attempt.attempt:
                attempt.attempt = Attempt()

            attempt.attempt.risk_score = risk_score
            attempt.attempt.violations_count = violations_count
            attempt.attempt.risk = risk

            attempt.save()

            return Response({
                "success": True,
                "risk_score": risk_score,
                "risk": risk
            })

        except Exception as e:

            return Response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def calculate_risk(violations):
    weights = {
        "NO_FACE_DETECTED": 3,
        "TAB_SWITCHED": 5,
        "SCREEN_SHARE_STOPPED": 10,
        "COPY_ATTEMPT": 2,
        "PHONE_DETECTED": 8
    }

    total_score = 0
    total_count = 0

    for v in violations:
        weight = weights.get(v.type, 1)

        total_score += weight * v.count
        total_count += v.count

    if total_score < 20:
        risk = "LOW"
    elif total_score < 50:
        risk = "MEDIUM"
    else:
        risk = "HIGH"
    
    return total_score, total_count, risk

class StartExam(APIView):
    def post(self, request):

        student_id = request.data.get("student")
        exam_id = request.data.get("exam")

        student = User.objects.get(id=student_id)
        exam = Exam.objects.get(id=exam_id)

        existing = ExamAttempt.objects(
            student=student,
            exam=exam
        ).first()
 
        if existing:
            if not existing.attempt:
                existing.attempt = Attempt()

            violations = existing.violations or []
            risk_score, violations_count, risk = calculate_risk(violations)
            existing.attempt.risk_score = risk_score
            existing.attempt.violations_count = violations_count
            existing.attempt.risk = risk

            existing.save()

            return Response({"success": True})
            
        attempt = Attempt()

        exam_attempt = ExamAttempt(
            student=student,
            exam=exam,
            attempt=attempt
        )

        exam_attempt.save()

        return Response({"success":True, "attempt_id": str(exam_attempt.id)})


class GetExamAttempts(APIView):
    def get(self, request, exam_id):

        attempts = ExamAttempt.objects(exam=exam_id)

        data = []

        for a in attempts:
            violations_list = []

            for v in a.violations:
                violations_list.append({
                    "type": v.type,
                    "count": v.count,
                    "screenShots": v.screenshots,
                    "timestamp": v.timestamp
                })

            data.append({
                "attempt_id": str(a.id),
                "student":{
                    "id": str(a.student.id),
                    "cId": a.student.cId,
                    "name": a.student.name,
                    "email": a.student.email
                },

                "exam_id": str(a.exam.id),
                "exam_name": a.exam.name,
                "subject": a.exam.subject,
                "score": a.attempt.score,
                "risk_score": a.attempt.risk_score if a.attempt else 0,
                "risk": a.attempt.risk if a.attempt else "LOW",
                "isTerminate": a.attempt.isTerminated,
                "violations_count": a.attempt.violations_count if a.attempt else 0,
                "status": a.attempt.status if a.attempt else "Not Started",
                "violations": violations_list,

                "created_at": a.created_at
            })
        
        return Response({
            "success": True,
            "attempts": data
        })
    

# class SubmitExam(APIView):

#     def post(self, request):

#         student_id = request.data.get("student")
#         exam_id = request.data.get("exam")
#         score = request.data.get("score")

#         try:

#             student = User.objects(id=student_id).first()
#             exam = Exam.objects(id=exam_id).first()

#             if not student or not exam:
#                 return Response({
#                     "success": False,
#                     "message": "Student or Exam not found"
#                 })

#             attempt = ExamAttempt.objects(
#                 student=student,
#                 exam=exam
#             ).first()

#             if not attempt:
#                 return Response({
#                     "success": False,
#                     "message": "Exam attempt not found"
#                 })

#             # update result
#             attempt.attempt.status = "Submitted"
#             attempt.attempt.score = score
#             attempt.attempt.submitted_at = datetime.utcnow()

#             attempt.save()

#             return Response({
#                 "success": True,
#                 "message": "Exam submitted successfully"
#             })

#         except Exception as e:

#             return Response({
#                 "success": False,
#                 "message": str(e)
#             }, status=500)

class SubmitExam(APIView):

    def post(self, request):

        try:
            student_id = request.data.get("student")
            exam_id = request.data.get("exam")
            answers = request.data.get("answers", [])

            print("📥 Incoming Answers:", answers)

            student = User.objects(id=student_id).first()
            exam = Exam.objects(id=exam_id).first()

            if not student or not exam:
                return Response({
                    "success": False,
                    "message": "Student or Exam not found"
                })

            attempt = ExamAttempt.objects(
                student=student,
                exam=exam
            ).first()

            if not attempt or not attempt.attempt:
                return Response({
                    "success": False,
                    "message": "Exam attempt not found"
                })

            #  fetch all questions of this exam
            questions = Question.objects(exam=exam)

            # fast lookup map
            question_map = {str(q.id): q for q in questions}

            score = 0
            
            for ans in answers:

                qid = str(ans.get("question_id"))
                selected = ans.get("selected_option")

                if selected is None:
                    continue

                question = question_map.get(qid)

                if not question:
                    continue

                if selected < 0 or selected >= len(question.options):
                    continue

                try:
                    # convert "1" → 1
                    if int(question.correct_answer) == selected:
                        score += 1

                except:
                    # fallback if correct_answer is text
                    if question.options[selected].strip().lower() == question.correct_answer.strip().lower():
                        score += 1
            
            # save answers properly
            attempt.attempt.answers = [
                Answer(
                    question_id=ObjectId(ans.get("question_id")),
                    selected_option=ans.get("selected_option")
                )
                for ans in answers
            ]

            attempt.attempt.status = "Submitted"
            attempt.attempt.score = score
            attempt.attempt.submitted_at = datetime.utcnow()

            attempt.save()

            return Response({
                "success": True,
                "score": score
            })

        except Exception as e:
            import traceback
            print("🔥 ERROR:", str(e))
            traceback.print_exc()

            return Response({
                "success": False,
                "message": str(e)
            }, status=500)

class Terminate(APIView):
    def post(self, request):
        studentId = request.data.get("student_id")
        examId = request.data.get("exam_id")
        terminate = request.data.get("terminate")

        try:
            student = User.objects(id=studentId).first()
            exam = Exam.objects(id=examId).first()

            if not student or not exam:
                return Response({
                    "success": False,
                    "message": "Student or Exam not found"
                })
            
            attempt = ExamAttempt.objects(student=student, exam=exam).first()

            if not attempt:
                return Response({
                    "success": False,
                    "message": "Exam attempt not found"
                })
            
            attempt.attempt.isTerminated = terminate
            attempt.save()

            return Response({
                "success": True,
                "message": "Candidate is treminated"
            })

        except Exception as e:
            return Response({
                "success": False,
                "message": str(e)
            }, status=500)

class GetTerminate(APIView):
    def get(self, request, exam_id):
        attempts = ExamAttempt.objects(exam=exam_id)

        data = []

        for a in attempts:
            if a.attempt.isTerminated:
                data.append({
                    "attempt_id": str(a.id),
                    "student":{
                        "id": str(a.student.id),
                        "cId": a.student.cId,
                        "name": a.student.name,
                        "email": a.student.email
                    },
                    "exam_name": a.exam.name,
                    "subject": a.exam.subject,
                    "score": a.attempt.score,
                    "risk_score": a.attempt.risk_score if a.attempt else 0,
                    "risk": a.attempt.risk if a.attempt else "LOW",
                    "violations_count": a.attempt.violations_count if a.attempt else 0,
                    "status": a.attempt.status if a.attempt else "Not Started",
                })

        return Response({
            "success": True,
            "data": data
        })
    
class get_student_status(APIView):
    def get(self, request, id):
        studentId = id

        if not studentId:
            return Response({"success": False, "message":"Id not found"})
        
        student = ExamAttempt.objects(student=studentId).first()

        if student:
            status = student.attempt.status
            return Response({"success": True, "status": status})
        
        return Response({"success": False})
    
class publishedExam(APIView):
    def post(self, request):
        publish = request.data.get("publish")
        examId = request.data.get("id")

        exam = Exam.objects(id=examId).first()
        
        if publish:
            exam.is_published = publish
            exam.save()
            return Response({"success": True, "message": "exam published" })
        else:
            exam.is_published = publish
            exam.save()
            return Response({"success": True, "message": "exam unpublished" })
        