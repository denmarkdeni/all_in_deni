from mongoengine import Document, StringField, BooleanField, DateTimeField, ListField, EmbeddedDocument, EmbeddedDocumentField, IntField, FloatField
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(Document):
    username = StringField(required=True, unique=True)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    role = StringField(default="STUDENT")  # ADMIN / STUDENT
    is_active = BooleanField(default=True)
    batch = StringField()  # Format: "YYYY-MM" e.g., "2024-01"
    full_name = StringField()  # Full name of the user
    education = StringField()  # Education level/degree
    other_info = StringField()  # Additional information
    created_at = DateTimeField(default=datetime.utcnow)

    def set_password(self, raw_password):
        self.password = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password, raw_password)


class Batch(Document):
    """Represents a month-year batch of students"""
    batch_code = StringField(required=True, unique=True)  # Format: "YYYY-MM" e.g., "2024-01"
    name = StringField(required=True)  # e.g., "January 2024 Batch"
    created_at = DateTimeField(default=datetime.utcnow)
    is_active = BooleanField(default=True)

    meta = {
        'indexes': ['batch_code']
    }


class Question(EmbeddedDocument):
    """MCQ Question embedded in Quiz"""
    question_text = StringField(required=True)
    options = ListField(StringField(), required=True)  # List of 4 options typically
    correct_answer = IntField(required=True)  # Index of correct option (0-based)
    points = IntField(default=1)  # Points for this question


class Quiz(Document):
    """Quiz containing multiple MCQ questions"""
    title = StringField(required=True)
    description = StringField()
    batch = StringField(required=True)  # Batch code this quiz is assigned to
    questions = ListField(EmbeddedDocumentField(Question), required=True)
    total_points = IntField(default=0)  # Sum of all question points
    duration_minutes = IntField(default=30)  # Time limit in minutes
    created_by = StringField(required=True)  # Username of admin who created it
    created_at = DateTimeField(default=datetime.utcnow)
    is_active = BooleanField(default=True)
    start_date = DateTimeField()  # When quiz becomes available
    end_date = DateTimeField()  # When quiz expires

    meta = {
        'indexes': ['batch', 'created_at']
    }

    def calculate_total_points(self):
        """Calculate total points from all questions"""
        self.total_points = sum(q.points for q in self.questions)
        return self.total_points


class QuizAttempt(Document):
    """Tracks student's attempt at a quiz"""
    student_username = StringField(required=True)
    quiz_id = StringField(required=True)  # Reference to Quiz
    batch = StringField(required=True)  # Student's batch
    answers = ListField(IntField())  # List of selected option indices
    score = FloatField(default=0.0)
    total_points = FloatField(default=0.0)
    percentage = FloatField(default=0.0)
    started_at = DateTimeField(default=datetime.utcnow)
    submitted_at = DateTimeField()
    time_taken_minutes = IntField(default=0)
    is_submitted = BooleanField(default=False)

    meta = {
        'indexes': ['student_username', 'quiz_id', 'batch', 'submitted_at']
    }


