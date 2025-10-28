# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from .models import Student
# from .serializers import StudentSerializer
# from django.contrib.auth.hashers import check_password

# class StudentViewSet(viewsets.ModelViewSet):
#     queryset = Student.objects.all()
#     serializer_class = StudentSerializer

# @api_view(['POST'])
# def login_view(request):
#     username = request.data.get('username')
#     password = request.data.get('password')

#     try:
#         student = Student.objects.get(username=username)
#         if check_password(password, student.password):
#             return Response({"success": True, "message": "Login successful", "student": student.username})
#         else:
#             return Response({"success": False, "message": "Invalid password"}, status=status.HTTP_401_UNAUTHORIZED)
#     except Student.DoesNotExist:
#         return Response({"success": False, "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Student
from .serializers import StudentSerializer

@api_view(['POST'])
def register_student(request):
    serializer = StudentSerializer(data=request.data)
    if serializer.is_valid():
        # Check if username/email already exists
        if Student.objects(username=serializer.validated_data['username']).first():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if Student.objects(email=serializer.validated_data['email']).first():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response({"success": True, 'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_student(request):
    username = request.data.get('username')
    password = request.data.get('password')

    student = Student.objects(username=username, password=password).first()
    if student:
        return Response({"success": True, 'message': 'Login successful', 'student': student.username})
    return Response({"success": False, 'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
