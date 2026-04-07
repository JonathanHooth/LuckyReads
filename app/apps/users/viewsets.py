from rest_framework import generics, permissions, serializers, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from drf_spectacular.utils import extend_schema

from apps.core.abstracts.viewsets import ViewSetBase
from apps.users.models import User
from apps.users.permissions import IsOwnerOrReadOnly
from apps.users.serializers import LoginSerializer, RegisterSerializer, UserSerializer, PublicUserSerializer

@extend_schema(
    request=RegisterSerializer,
    responses={201: UserSerializer}
)
class RegisterView(APIView):
    """
    POST /api/users/register
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
                'user': UserSerializer(user, context={'request': request}).data
            },
            status=status.HTTP_201_CREATED
        )
  
class LoginView(APIView):
    """
    POST /api/users/login/
    """

    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=LoginSerializer,
        responses={200: UserSerializer}
    )
    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                'token': token.key,
                'user': UserSerializer(user, context={'request': request}).data
            }
        )
    
class UserViewSet(viewsets.ModelViewSet):
    """
    GET /api/users/
    GET /api/users/<username>/
    PATCH /api/users/<username>/
    DELETE /api/users/<username>/
    """

    queryset = User.objects.filter(is_active=True)
    lookup_field = 'username'
    permission_classes = [IsOwnerOrReadOnly]
    http_method_names = ['get', 'patch', 'delete', 'head', 'options']
    serializer_class = UserSerializer

    def get_object(self) -> User:
        username = self.kwargs.get('username')
        obj = generics.get_object_or_404(
            User.objects.filter(is_active=True),
            username=username
        )

        self.check_object_permissions(self.request, obj)
        return obj

    def get_serializer_class(self) -> type[serializers.ModelSerializer]:
        if self.action in ('retrieve', 'partial_update'):
            obj = self.get_object()
            if obj == self.request.user:
              return UserSerializer
        return PublicUserSerializer
    
    def perform_destroy(self, instance: User) -> None:
        instance.is_active = False
        instance.save()