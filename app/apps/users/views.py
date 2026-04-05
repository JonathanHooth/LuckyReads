from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.serializers import LoginSerializer, RegisterSerializer, UserProfileSerializer

class RegisterView(APIView):
    """
    POST /api/auth/register/
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request: Request) -> Response:
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                'token': token.key,
                'user': UserProfileSerializer(user).data
            }, 
            status=status.HTTP_201_CREATED
        )
    
class LoginView(APIView):
    """
    POST /api/auth/login/
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                'token': token.key,
                'user': UserProfileSerializer(user).data
            }
        )
    
class ProfileMeView(generics.RetrieveUpdateAPIView):
    """
    GET /api/profile/me
    PATCH /api/profile/me
    """

    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user