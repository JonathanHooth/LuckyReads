import re

from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import Permission
from django.shortcuts import get_object_or_404
from apps.utils.permissions import get_permission

User = get_user_model()


class CustomBackend(ModelBackend):
    """Custom backend for managing permissions, etc."""

    def authenticate(self, request, username=None, **kwargs):
        # Email Regex from: https://www.geeksforgeeks.org/check-if-email-address-valid-or-not-in-python/

        if re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", username):
            username = get_object_or_404(User, email=username)

        return super().authenticate(request, username, **kwargs)

    def has_global_perm(self, user_obj, perm):
        """
        Check if a user has permission to create objects that are not scoped.

        This just uses the default permission checking capability from django,
        instead of the custom methods defined in this backend.
        """

        return super(ModelBackend, self).has_perm(user_obj, perm)

    def has_perm(self, user_obj, perm, obj=None):
        """Runs when checking any user's permissions."""

        if user_obj.is_superuser:
            return True

        # Don't pass in obj, ModelBackend will short circuit and
        # return empty set for user permissions, always returning false.
        has_user_perm = super(ModelBackend, self).has_perm(user_obj, perm)

        return has_user_perm
