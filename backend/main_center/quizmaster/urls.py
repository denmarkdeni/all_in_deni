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
    path('register/', views.register_student, name='register'),
    path('login/', views.login_student, name='login'),
]
