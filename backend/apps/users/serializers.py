from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    candidateId = serializers.CharField()
    password = serializers.CharField()

class StudentCreateSerializer(serializers.Serializer):
    name = serializers.CharField()
    cId = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    password = serializers.CharField()


class UserSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    cId = serializers.CharField()
    email = serializers.EmailField()