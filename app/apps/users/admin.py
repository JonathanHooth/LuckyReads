from django.contrib import admin

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from apps.core.admin import ModelAdminBase

from .models import User



class UserAdmin(BaseUserAdmin, ModelAdminBase):
  """Manager users in admin dashboard."""

  list_display = ("username", "email", "name", "is_staff", "bio")
  search_fields = ("username", "email")

  readonly_fields = (
    *BaseUserAdmin.readonly_fields,
  )




admin.site.register(User, UserAdmin)