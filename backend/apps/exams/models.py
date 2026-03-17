from django.db import models
import mongoengine as me
from datetime import datetime
from apps.users.models import User
# Create your models here.

class Exam(me.Document):
    name = me.StringField(required=True)
    subject = me.StringField(required=True)
    duration = me.IntField(required=True)  # minutes
    total_questions = me.IntField(default=0)
    is_published = me.BooleanField(default=False)
    created_at = me.DateTimeField(default=datetime.utcnow)
    
    meta = {'collection' : 'exams'}


class Question(me.Document):
    exam = me.ReferenceField(Exam, reverse_delete_rule=me.CASCADE)
    question_text = me.StringField(required=True)
    options = me.ListField(me.StringField(), required=True, min_length=4, max_length=4)
    correct_answer = me.StringField(required=True)
    created_at = me.DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'questions'}

class Violation(me.EmbeddedDocument):
    type = me.StringField(required=True)
    count = me.IntField(default=1)
    screenshots = me.ListField(me.StringField())
    timestamp = me.DateTimeField(default=datetime.utcnow)

class Attempt(me.EmbeddedDocument):
    status = me.StringField(default="In Progress")
    score = me.IntField(default=0)
    violations_count = me.IntField(default=0)
    recording = me.BooleanField(default=True)
    risk = me.StringField(default="LOW")
    submitted_at = me.DateTimeField()
    risk_score = me.IntField(default=0)
    isTerminated = me.BooleanField(default=False)
    report_pdf = me.FileField()   


class ExamAttempt(me.Document):
    student = me.ReferenceField(User, required=True, reverse_delete_rule = me.CASCADE)
    exam = me.ReferenceField(Exam, required=True, reverse_delete_rule = me.CASCADE)
    violations = me.EmbeddedDocumentListField(Violation)
    attempt = me.EmbeddedDocumentField(Attempt)
    created_at = me.DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "exam_attempts"
    }

