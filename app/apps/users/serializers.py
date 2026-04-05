from django.contrib.auth import authenticate
from rest_framework import serializers

from apps.core.abstracts.serializers import ModelSerializer
from apps.users.models import User

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']

    def validate(self, data: dict) -> dict:
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError('Passwords do not match.')
        return data
    
    def create(self, validated_data: dict) -> User:
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user
    
class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data: dict) -> dict:
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')
        data['user'] = user
        return data
    
class PublicUserProfileSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'bio', 'avatar_url']
        read_only_fields = ['id']

class UserProfileSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'avatar_url']
        read_only_fields = ['id', 'email']
