

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

class LoginSerializer(serializers.Serializer):
  username = serializers.CharField()
  password = serializers.CharField()