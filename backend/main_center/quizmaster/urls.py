# from django.urls import path, include
# from quizmaster import views
# from rest_framework.routers import DefaultRouter

# router = DefaultRouter()
# router.register(r'students', views.StudentViewSet)

# urlpatterns = [
#     path('', include(router.urls)),
#     path('login/', views.login_view, name='login'),
# ]

from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    
    # User Profile
    path('profile/', views.get_user_profile, name='get_user_profile'),
    path('profile/update/', views.update_user_profile, name='update_user_profile'),
    
    # Batch Management
    path('batches/', views.list_batches, name='list_batches'),
    path('batches/create/', views.create_batch, name='create_batch'),
    
    # Quiz Management
    path('quizzes/', views.list_quizzes, name='list_quizzes'),
    path('quizzes/create/', views.create_quiz, name='create_quiz'),
    path('quizzes/<str:quiz_id>/', views.get_quiz, name='get_quiz'),
    
    # Quiz Attempts
    path('quizzes/start/', views.start_quiz, name='start_quiz'),
    path('quizzes/submit/', views.submit_quiz, name='submit_quiz'),
    path('quizzes/<str:quiz_id>/results/', views.get_quiz_results, name='get_quiz_results'),
    path('attempts/', views.get_student_attempts, name='get_student_attempts'),
    
    # Batch-wise Results (Admin)
    path('results/batch/', views.get_batch_results, name='get_batch_results'),
]
