from rest_framework import serializers
from .models import User, Batch, Quiz, Question, QuizAttempt
from datetime import datetime

class UserSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(default="STUDENT")
    is_active = serializers.BooleanField(default=True)
    batch = serializers.CharField(required=False, allow_blank=True)
    full_name = serializers.CharField(required=False, allow_blank=True)
    education = serializers.CharField(required=False, allow_blank=True)
    other_info = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserProfileSerializer(serializers.Serializer):
    """Serializer for user profile (without password)"""
    username = serializers.CharField(read_only=True)
    email = serializers.EmailField()
    role = serializers.CharField(read_only=True)
    batch = serializers.CharField(required=False, allow_blank=True)
    full_name = serializers.CharField(required=False, allow_blank=True)
    education = serializers.CharField(required=False, allow_blank=True)
    other_info = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)


class BatchSerializer(serializers.Serializer):
    batch_code = serializers.CharField()
    name = serializers.CharField()
    is_active = serializers.BooleanField(default=True)


class QuestionSerializer(serializers.Serializer):
    question_text = serializers.CharField()
    options = serializers.ListField(child=serializers.CharField())
    correct_answer = serializers.IntegerField()
    points = serializers.IntegerField(default=1)


class QuizSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    batch = serializers.CharField()
    questions = QuestionSerializer(many=True)
    duration_minutes = serializers.IntegerField(default=30)
    start_date = serializers.DateTimeField(required=False, allow_null=True)
    end_date = serializers.DateTimeField(required=False, allow_null=True)
    is_active = serializers.BooleanField(default=True)

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        quiz = Quiz(**validated_data)
        
        # Convert question dicts to Question embedded documents
        quiz.questions = [Question(**q) for q in questions_data]
        quiz.calculate_total_points()
        quiz.save()
        return quiz


class QuizListSerializer(serializers.Serializer):
    """Serializer for listing quizzes without questions"""
    id = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    batch = serializers.CharField()
    total_points = serializers.IntegerField()
    duration_minutes = serializers.IntegerField()
    created_at = serializers.DateTimeField()
    is_active = serializers.BooleanField()
    start_date = serializers.DateTimeField(allow_null=True)
    end_date = serializers.DateTimeField(allow_null=True)


class QuizAttemptSerializer(serializers.Serializer):
    quiz_id = serializers.CharField()
    answers = serializers.ListField(child=serializers.IntegerField())


class QuizAttemptResultSerializer(serializers.Serializer):
    """Serializer for quiz attempt results"""
    id = serializers.CharField()
    student_username = serializers.CharField()
    quiz_id = serializers.CharField()
    batch = serializers.CharField()
    score = serializers.FloatField()
    total_points = serializers.FloatField()
    percentage = serializers.FloatField()
    submitted_at = serializers.DateTimeField(allow_null=True)
    time_taken_minutes = serializers.IntegerField()
    is_submitted = serializers.BooleanField()
