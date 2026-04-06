

from rest_framework import serializers

from apps.core.abstracts.serializers import ModelSerializer, ModelSerializerBase
from django.contrib.auth import get_user_model

class UserSerializer(ModelSerializer):

  email = serializers.EmailField()
  username = serializers.CharField(required=False)
  
  bio = serializers.CharField(required=False)

  class Meta:
    model = get_user_model()
    fields = [
      *ModelSerializerBase.default_fields,
      "username",
      "email",
      "password",
      "bio",
    ]
    # defines characteristics of specific fields
    extra_kwargs = {"password": {"write_only": True, "min_length": 5}}


  def create(self, validated_data):
    """Create and return a user with encrypted password"""
    return get_user_model().objects.create_user(**validated_data)
  
  def update(self, validated_data):
     """Update and return user"""

     #password = validated_data.pop("password", None)
     #profile_data = validated_data.pop("bio", None)
     #socials_data = validated_data.pop("socials", None)
     #user = super().update(instance, validated_data)
  

class LoginSerializer(serializers.Serializer):
  username = serializers.CharField()
  password = serializers.CharField()