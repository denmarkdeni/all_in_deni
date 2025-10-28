# from djongo import models

# class Student(models.Model):
#     full_name = models.CharField(max_length=100)
#     username = models.CharField(max_length=50, unique=True)
#     email = models.EmailField(unique=True)
#     password = models.CharField(max_length=255)

#     def __str__(self):
#         return self.username

from mongoengine import Document, StringField, EmailField, BooleanField

class Student(Document):
    full_name = StringField(required=True, max_length=100)
    username = StringField(required=True, unique=True, max_length=50)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True, max_length=255)
    is_active = BooleanField(default=True)

    def __str__(self):
        return self.username

