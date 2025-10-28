# from rest_framework import serializers
# from .models import Student
# from django.contrib.auth.hashers import make_password

# class StudentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Student
#         fields = '__all__'
#         extra_kwargs = {'password': {'write_only': True}}

#     def create(self, validated_data):
#         validated_data['password'] = make_password(validated_data['password'])
#         return super(StudentSerializer, self).create(validated_data)

from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        student = Student(**validated_data)
        student.save()
        return student
