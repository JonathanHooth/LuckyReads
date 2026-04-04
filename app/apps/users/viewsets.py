from rest_framework import mixins

from rest_framework.authtoken.views import ObtainAuthToken, Response

from apps.core.abstracts.viewsets import ViewSetBase
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from drf_spectacular.utils import extend_schema
from rest_framework.settings import api_settings
from rest_framework import authentication
from apps.users.models import User
from apps.users.serializers import LoginSerializer, UserSerializer


class UserViewSet(mixins.RetrieveModelMixin, ViewSetBase):
  """Create a new user in the system."""

  serializer_class = UserSerializer
  queryset = User.objects.all()

class AuthTokenView(
  ObtainAuthToken,
  mixins.RetrieveModelMixin,
  ViewSetBase,
):
  """Gets or generates token for user given credientials"""
  renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
  authentication_classes = [
    authentication.TokenAuthentication,
    authentication.SessionAuthentication,
  ]
  
  @extend_schema(request=LoginSerializer)
  def post(self, request, *args, **kwargs):
      return super().post(request, *args, **kwargs)

  def retrieve(self, request, *args, **kwargs):
    if request.user.is_anonymous:
      raise AuthenticationFailed(
        "Unable to retrieve token for unauthenticated user."
      )
    
    token,_ = Token.objects.get_or_create(user=request.user)
    return Response({"token": token.key})
