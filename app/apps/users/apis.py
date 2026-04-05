"""
URL Patterns for users REST API.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.users import viewsets

router = DefaultRouter()
router.register("", viewsets.UserViewSet, basename="user")

app_name = "api-users"

urlpatterns = [
  path('register/', viewsets.RegisterView.as_view(), name='register'),
  path('login/', viewsets.LoginView.as_view(), name='login'),
  *router.urls
]
