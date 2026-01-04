from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import User, Batch, Quiz, Question, QuizAttempt
from .serializers import (
    UserSerializer, UserProfileSerializer, BatchSerializer, QuizSerializer, QuizListSerializer,
    QuizAttemptSerializer, QuizAttemptResultSerializer, QuestionSerializer
)
from datetime import datetime, timedelta
from bson import ObjectId
from bson.errors import InvalidId

@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        # Check if username/email already exists
        if User.objects(username=serializer.validated_data['username']).first():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects(email=serializer.validated_data['email']).first():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response({"success": True, 'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = User.objects(username=username).first()
    if user and user.check_password(password):
        return Response({
            "success": True,
            "message": "Login successful",
            "username": user.username,
            "role": user.role
        })

    return Response(
        {"success": False, "error": "Invalid credentials"},
        status=status.HTTP_401_UNAUTHORIZED
    )


# ==================== USER PROFILE MANAGEMENT ====================

@api_view(['GET'])
def get_user_profile(request):
    """Get user profile information"""
    username = request.GET.get('username')
    
    if not username:
        return Response(
            {'error': 'Username required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects(username=username).first()
    if not user:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    profile_data = {
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'batch': user.batch or '',
        'full_name': user.full_name or '',
        'education': user.education or '',
        'other_info': user.other_info or '',
        'created_at': user.created_at.isoformat() if user.created_at else None,
    }
    
    return Response({"success": True, "profile": profile_data})


@api_view(['PUT', 'PATCH'])
def update_user_profile(request):
    """Update user profile information"""
    username = request.data.get('username')
    
    if not username:
        return Response(
            {'error': 'Username required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects(username=username).first()
    if not user:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = UserProfileSerializer(data=request.data, partial=True)
    if serializer.is_valid():
        # Update allowed fields
        if 'email' in serializer.validated_data:
            # Check if email is already taken by another user
            existing_user = User.objects(email=serializer.validated_data['email']).first()
            if existing_user and existing_user.username != username:
                return Response(
                    {'error': 'Email already exists'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.email = serializer.validated_data['email']
        
        if 'batch' in serializer.validated_data:
            user.batch = serializer.validated_data['batch']
        
        if 'full_name' in serializer.validated_data:
            user.full_name = serializer.validated_data['full_name']
        
        if 'education' in serializer.validated_data:
            user.education = serializer.validated_data['education']
        
        if 'other_info' in serializer.validated_data:
            user.other_info = serializer.validated_data['other_info']
        
        user.save()
        
        profile_data = {
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'batch': user.batch or '',
            'full_name': user.full_name or '',
            'education': user.education or '',
            'other_info': user.other_info or '',
            'created_at': user.created_at.isoformat() if user.created_at else None,
        }
        
        return Response({
            "success": True,
            "message": "Profile updated successfully",
            "profile": profile_data
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== BATCH MANAGEMENT ====================

@api_view(['GET'])
def list_batches(request):
    """List all batches"""
    batches = Batch.objects(is_active=True).order_by('-created_at')
    serializer = BatchSerializer(batches, many=True)
    return Response({"success": True, "batches": serializer.data})


@api_view(['POST'])
def create_batch(request):
    """Create a new batch (Admin only)"""
    serializer = BatchSerializer(data=request.data)
    if serializer.is_valid():
        batch_code = serializer.validated_data['batch_code']
        if Batch.objects(batch_code=batch_code).first():
            return Response(
                {'error': 'Batch with this code already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        batch = Batch(**serializer.validated_data)
        batch.save()
        return Response(
            {"success": True, "message": "Batch created successfully", "batch": BatchSerializer(batch).data},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==================== QUIZ MANAGEMENT (ADMIN) ====================

@api_view(['POST'])
def create_quiz(request):
    """Create a new quiz (Admin only)"""
    username = request.data.get('username')  # Admin username
    if not username:
        return Response(
            {'error': 'Username required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects(username=username).first()
    if not user or user.role.upper() != 'ADMIN':
        return Response(
            {'error': 'Unauthorized. Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = QuizSerializer(data=request.data)
    if serializer.is_valid():
        # Validate batch exists
        batch_code = serializer.validated_data['batch']
        if not Batch.objects(batch_code=batch_code).first():
            return Response(
                {'error': f'Batch {batch_code} does not exist'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate questions
        questions = serializer.validated_data['questions']
        if not questions or len(questions) == 0:
            return Response(
                {'error': 'Quiz must have at least one question'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        for i, q in enumerate(questions):
            if len(q['options']) < 2:
                return Response(
                    {'error': f'Question {i+1} must have at least 2 options'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if q['correct_answer'] < 0 or q['correct_answer'] >= len(q['options']):
                return Response(
                    {'error': f'Question {i+1} has invalid correct answer index'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        quiz_data = serializer.validated_data.copy()
        quiz_data['created_by'] = username
        quiz = serializer.create(quiz_data)
        
        return Response(
            {
                "success": True,
                "message": "Quiz created successfully",
                "quiz_id": str(quiz.id),
                "total_points": quiz.total_points
            },
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def list_quizzes(request):
    """List all quizzes (Admin sees all, Student sees their batch)"""
    username = request.GET.get('username')
    batch = request.GET.get('batch')  # Optional filter
    
    if not username:
        return Response(
            {'error': 'Username required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects(username=username).first()
    if not user:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Admin sees all quizzes, Student sees only their batch
    if user.role.upper() == 'ADMIN':
        if batch:
            quizzes = Quiz.objects(batch=batch, is_active=True).order_by('-created_at')
        else:
            quizzes = Quiz.objects(is_active=True).order_by('-created_at')
    else:
        user_batch = user.batch
        if not user_batch:
            return Response(
                {"success": True, "quizzes": [], "message": "No batch assigned to user"}
            )
        quizzes = Quiz.objects(batch=user_batch, is_active=True).order_by('-created_at')
    
    quiz_list = []
    for quiz in quizzes:
        quiz_data = {
            'id': str(quiz.id),
            'title': quiz.title,
            'description': quiz.description or '',
            'batch': quiz.batch,
            'total_points': quiz.total_points,
            'duration_minutes': quiz.duration_minutes,
            'created_at': quiz.created_at.isoformat() if quiz.created_at else None,
            'is_active': quiz.is_active,
            'start_date': quiz.start_date.isoformat() if quiz.start_date else None,
            'end_date': quiz.end_date.isoformat() if quiz.end_date else None,
            'question_count': len(quiz.questions)
        }
        quiz_list.append(quiz_data)
    
    return Response({"success": True, "quizzes": quiz_list})


@api_view(['GET'])
def get_quiz(request, quiz_id):
    """Get quiz details with questions (for taking quiz)"""
    username = request.GET.get('username')
    
    if not username:
        return Response(
            {'error': 'Username required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        quiz = Quiz.objects.get(id=ObjectId(quiz_id), is_active=True)
    except (InvalidId, Quiz.DoesNotExist):
        return Response(
            {'error': 'Quiz not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    user = User.objects(username=username).first()
    if not user:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if student belongs to the quiz's batch
    if user.role.upper() != 'ADMIN' and user.batch != quiz.batch:
        return Response(
            {'error': 'You do not have access to this quiz'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Check if quiz is within time window
    now = datetime.utcnow()
    if quiz.start_date and now < quiz.start_date:
        return Response(
            {'error': 'Quiz has not started yet'},
            status=status.HTTP_400_BAD_REQUEST
        )
    if quiz.end_date and now > quiz.end_date:
        return Response(
            {'error': 'Quiz has expired'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if student already attempted
    attempt = QuizAttempt.objects(
        student_username=username,
        quiz_id=str(quiz.id),
        is_submitted=True
    ).first()
    
    if attempt and user.role.upper() != 'ADMIN':
        return Response(
            {'error': 'You have already submitted this quiz'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Return quiz without correct answers for students
    questions_data = []
    for q in quiz.questions:
        question = {
            'question_text': q.question_text,
            'options': q.options,
            'points': q.points
        }
        # Only include correct answer for admin
        if user.role.upper() == 'ADMIN':
            question['correct_answer'] = q.correct_answer
        questions_data.append(question)
    
    quiz_data = {
        'id': str(quiz.id),
        'title': quiz.title,
        'description': quiz.description or '',
        'batch': quiz.batch,
        'total_points': quiz.total_points,
        'duration_minutes': quiz.duration_minutes,
        'questions': questions_data,
        'start_date': quiz.start_date.isoformat() if quiz.start_date else None,
        'end_date': quiz.end_date.isoformat() if quiz.end_date else None,
    }
    
    return Response({"success": True, "quiz": quiz_data})


# ==================== QUIZ ATTEMPTS (STUDENT) ====================

@api_view(['POST'])
def start_quiz(request):
    """Start a quiz attempt (track start time)"""
    username = request.data.get('username')
    quiz_id = request.data.get('quiz_id')
    
    if not username or not quiz_id:
        return Response(
            {'error': 'Username and quiz_id required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects(username=username).first()
    if not user:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        quiz = Quiz.objects.get(id=ObjectId(quiz_id), is_active=True)
    except (InvalidId, Quiz.DoesNotExist):
        return Response(
            {'error': 'Quiz not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if student belongs to the quiz's batch
    if user.role.upper() != 'ADMIN' and user.batch != quiz.batch:
        return Response(
            {'error': 'You do not have access to this quiz'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Check if already submitted
    existing_attempt = QuizAttempt.objects(
        student_username=username,
        quiz_id=quiz_id,
        is_submitted=True
    ).first()
    
    if existing_attempt:
        return Response(
            {'error': 'You have already submitted this quiz'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create or get existing attempt
    attempt = QuizAttempt.objects(
        student_username=username,
        quiz_id=quiz_id,
        is_submitted=False
    ).first()
    
    if not attempt:
        attempt = QuizAttempt(
            student_username=username,
            quiz_id=quiz_id,
            batch=user.batch or quiz.batch,
            started_at=datetime.utcnow()
        )
        attempt.save()
    
    return Response({
        "success": True,
        "message": "Quiz started",
        "attempt_id": str(attempt.id),
        "started_at": attempt.started_at.isoformat() if attempt.started_at else None,
        "duration_minutes": quiz.duration_minutes
    })


@api_view(['POST'])
def submit_quiz(request):
    """Submit quiz answers and calculate score"""
    username = request.data.get('username')
    serializer = QuizAttemptSerializer(data=request.data)
    
    if not username:
        return Response(
            {'error': 'Username required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects(username=username).first()
    if not user:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    quiz_id = serializer.validated_data['quiz_id']
    answers = serializer.validated_data['answers']
    
    try:
        quiz = Quiz.objects.get(id=ObjectId(quiz_id), is_active=True)
    except (InvalidId, Quiz.DoesNotExist):
        return Response(
            {'error': 'Quiz not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if student belongs to the quiz's batch
    if user.role.upper() != 'ADMIN' and user.batch != quiz.batch:
        return Response(
            {'error': 'You do not have access to this quiz'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Check if already submitted
    existing_attempt = QuizAttempt.objects(
        student_username=username,
        quiz_id=quiz_id,
        is_submitted=True
    ).first()
    
    if existing_attempt:
        return Response(
            {'error': 'You have already submitted this quiz'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Calculate score
    score = 0.0
    total_points = 0.0
    
    for i, question in enumerate(quiz.questions):
        total_points += question.points
        if i < len(answers) and answers[i] == question.correct_answer:
            score += question.points
    
    percentage = (score / total_points * 100) if total_points > 0 else 0
    
    # Create or update attempt
    attempt = QuizAttempt.objects(
        student_username=username,
        quiz_id=quiz_id,
        is_submitted=False
    ).first()
    
    if not attempt:
        attempt = QuizAttempt(
            student_username=username,
            quiz_id=quiz_id,
            batch=user.batch or quiz.batch,
            started_at=datetime.utcnow()
        )
    
    attempt.answers = answers
    attempt.score = score
    attempt.total_points = total_points
    attempt.percentage = percentage
    attempt.submitted_at = datetime.utcnow()
    attempt.is_submitted = True
    
    # Calculate time taken (if started_at exists)
    if attempt.started_at:
        time_diff = attempt.submitted_at - attempt.started_at
        attempt.time_taken_minutes = int(time_diff.total_seconds() / 60)
    
    attempt.save()
    
    return Response({
        "success": True,
        "message": "Quiz submitted successfully",
        "score": score,
        "total_points": total_points,
        "percentage": round(percentage, 2),
        "attempt_id": str(attempt.id)
    })


@api_view(['GET'])
def get_quiz_results(request, quiz_id):
    """Get results for a specific quiz (Student sees own, Admin sees all)"""
    username = request.GET.get('username')
    
    if not username:
        return Response(
            {'error': 'Username required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects(username=username).first()
    if not user:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        quiz = Quiz.objects.get(id=ObjectId(quiz_id))
    except (InvalidId, Quiz.DoesNotExist):
        return Response(
            {'error': 'Quiz not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if user.role.upper() == 'ADMIN':
        # Admin sees all attempts
        attempts = QuizAttempt.objects(quiz_id=quiz_id, is_submitted=True).order_by('-submitted_at')
    else:
        # Student sees only their attempt
        attempts = QuizAttempt.objects(
            quiz_id=quiz_id,
            student_username=username,
            is_submitted=True
        ).order_by('-submitted_at')
    
    results = []
    for attempt in attempts:
        result = {
            'id': str(attempt.id),
            'student_username': attempt.student_username,
            'batch': attempt.batch,
            'score': attempt.score,
            'total_points': attempt.total_points,
            'percentage': round(attempt.percentage, 2),
            'submitted_at': attempt.submitted_at.isoformat() if attempt.submitted_at else None,
            'time_taken_minutes': attempt.time_taken_minutes
        }
        results.append(result)
    
    return Response({
        "success": True,
        "quiz_title": quiz.title,
        "results": results
    })


# ==================== BATCH-WISE RESULTS (ADMIN) ====================

@api_view(['GET'])
def get_batch_results(request):
    """Get all results grouped by batch (Admin only)"""
    username = request.GET.get('username')
    batch = request.GET.get('batch')  # Optional filter
    
    if not username:
        return Response(
            {'error': 'Username required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects(username=username).first()
    if not user or user.role.upper() != 'ADMIN':
        return Response(
            {'error': 'Unauthorized. Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get all submitted attempts
    if batch:
        attempts = QuizAttempt.objects(batch=batch, is_submitted=True).order_by('-submitted_at')
    else:
        attempts = QuizAttempt.objects(is_submitted=True).order_by('-submitted_at')
    
    # Group by batch
    batch_results = {}
    for attempt in attempts:
        batch_code = attempt.batch
        if batch_code not in batch_results:
            batch_results[batch_code] = {
                'batch': batch_code,
                'total_attempts': 0,
                'students': [],
                'quizzes': {}
            }
        
        batch_results[batch_code]['total_attempts'] += 1
        
        # Get quiz info
        try:
            quiz = Quiz.objects.get(id=ObjectId(attempt.quiz_id))
            quiz_title = quiz.title
        except:
            quiz_title = "Unknown Quiz"
        
        if quiz_title not in batch_results[batch_code]['quizzes']:
            batch_results[batch_code]['quizzes'][quiz_title] = []
        
        result_data = {
            'student_username': attempt.student_username,
            'quiz_id': attempt.quiz_id,
            'quiz_title': quiz_title,
            'score': attempt.score,
            'total_points': attempt.total_points,
            'percentage': round(attempt.percentage, 2),
            'submitted_at': attempt.submitted_at.isoformat() if attempt.submitted_at else None
        }
        
        batch_results[batch_code]['quizzes'][quiz_title].append(result_data)
        
        # Track unique students
        if attempt.student_username not in batch_results[batch_code]['students']:
            batch_results[batch_code]['students'].append(attempt.student_username)
    
    # Convert to list format
    result_list = []
    for batch_code, data in batch_results.items():
        data['student_count'] = len(data['students'])
        result_list.append(data)
    
    return Response({
        "success": True,
        "batch_results": result_list
    })


@api_view(['GET'])
def get_student_attempts(request):
    """Get all quiz attempts for a student"""
    username = request.GET.get('username')
    student_username = request.GET.get('student_username', username)  # Admin can view any student
    
    if not username:
        return Response(
            {'error': 'Username required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects(username=username).first()
    if not user:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check permissions
    if user.role.upper() != 'ADMIN' and username != student_username:
        return Response(
            {'error': 'Unauthorized'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    attempts = QuizAttempt.objects(
        student_username=student_username,
        is_submitted=True
    ).order_by('-submitted_at')
    
    results = []
    for attempt in attempts:
        try:
            quiz = Quiz.objects.get(id=ObjectId(attempt.quiz_id))
            quiz_title = quiz.title
        except:
            quiz_title = "Unknown Quiz"
        
        result = {
            'id': str(attempt.id),
            'quiz_id': attempt.quiz_id,
            'quiz_title': quiz_title,
            'batch': attempt.batch,
            'score': attempt.score,
            'total_points': attempt.total_points,
            'percentage': round(attempt.percentage, 2),
            'submitted_at': attempt.submitted_at.isoformat() if attempt.submitted_at else None,
            'time_taken_minutes': attempt.time_taken_minutes
        }
        results.append(result)
    
    return Response({
        "success": True,
        "student_username": student_username,
        "attempts": results
    })