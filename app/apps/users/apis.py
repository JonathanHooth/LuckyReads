"""
URL Patterns for users REST API.
"""

from django.urls import include, path, reverse_lazy
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter

from users import viewsets

