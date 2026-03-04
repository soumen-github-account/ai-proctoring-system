
from rest_framework import serializers

class ExamSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    name = serializers.CharField()
    subject = serializers.CharField()
    duration = serializers.IntegerField()
    total_questions = serializers.IntegerField()
    is_published = serializers.BooleanField()
    created_at = serializers.DateTimeField()

    def get_id(self, obj):
        return str(obj.id)

class ViolationSerializer(serializers.Serializer):
    student = serializers.CharField()
    exam = serializers.CharField()
    message = serializers.CharField()


class SubmitExamSerializer(serializers.Serializer):
    student = serializers.CharField()
    exam = serializers.CharField()
    answers_score = serializers.IntegerField()