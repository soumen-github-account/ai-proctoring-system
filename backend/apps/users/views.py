from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import LoginSerializer, StudentCreateSerializer, UserSerializer
from .models import User
from .service import hash_password, verify_password
from datetime import datetime
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class add_student(APIView):

    def post(self, request):
        serializer = StudentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        if User.objects(email=data['email']).first():
            return Response({"success": False, "message": "Email already exists"})

        if User.objects(phone=data['phone']).first():
            return Response({"success": False, "message": "Phone no. already exists"})

        for user in User.objects():
            if verify_password(data['password'], user.password):
                return Response({"success":False, "message": "Give an unique password"})
        
        User(
            name=data['name'],
            cId=data['cId'],
            email=data['email'],
            phone=data['phone'],
            password=hash_password(data['password']),
            created_at=datetime.utcnow()
        ).save()

        return Response({"success": True, "message": "Student created successfully"})

    

class student_login(APIView):

    def post(self, request):
        print("REQUEST DATA:", request.data)
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        candidateId = serializer.validated_data['candidateId']
        password = serializer.validated_data['password']

        user = User.objects(cId=candidateId).first()

        if not user:
            return Response({"success": False, "message": "User not found"}, status=404)

        if not verify_password(password, user.password):
            return Response({"success": False, "error": "Invalid credentials"}, status=400)

        tokens = get_tokens_for_user(user)

        return Response({
            "success": True,
            "message": "Login successful",
            "token": tokens["access"],
            "refresh": tokens["refresh"],
            "user": UserSerializer(user).data
        })
    

class get_students(APIView):
    def get(self, request):
        students = User.objects

        return Response([
            {
                "studentId": s.cId,
                "name": s.name,
                "email": s.email,
                "phone": getattr(s, "phone", "")
            }
            for s in students
        ])
    
class delete_student(APIView):
    def delete(self, request, student_id):
        student = User.objects(cId = student_id).first()

        if not student:
            return Response({"success": False, "message": "not found"}, status=404)
        
        student.delete()
        return Response({"success": True, "message":"Deleted Successfully."})
    

class update_student(APIView):

    def put(self, request, student_id):
        student = User.objects(cId = student_id).first()

        if not student:
            return Response({"success":False, "message": "Student not found"})
        
        serializer = StudentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Email check
        if User.objects(email=data['email'], id__ne=student.id).first():
            return Response({"success": False, "message": "Email already exists"})
        
        # Phone check
        if User.objects(phone=data['phone'], id__ne=student.id).first():
            return Response({"success": False, "message": "Phone already exists"})
        
         # Password uniqueness check
        for user in User.objects(id__ne=student.id):
            if verify_password(data['password'], user.password):
                return Response({"success": False, "message": "Give an unique password"})

        student.name = data['name']
        student.cId = data['cId']
        student.email = data['email']
        student.phone = data['phone']
        student.password = hash_password(data['password'])
        student.updated_at = datetime.utcnow()

        student.save()

        return Response({"success": True, "message": "Student updated successfully"})