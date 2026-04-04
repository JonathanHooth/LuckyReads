"""
URL Patterns for users REST API.
"""

from django.urls import include, path, reverse_lazy
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter

from apps.users import viewsets

router = DefaultRouter()

router.register("users", viewsets.UserViewSet, basename="user")

app_name = "api-users"

urlpatterns = [
  path("", include(router.urls)),
  path("login/", RedirectView.as_view(url=reverse_lazy("api-users:login"))),
  path(
      "token/",
      viewsets.AuthTokenView.as_view({"get": "retrieve", "post": "post"}),
      name="login",
  ),

]
