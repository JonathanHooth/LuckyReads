from django.contrib import admin
from django.utils.translation import gettext_lazy as _

def get_admin_context(request, extra_context=None):
    """Get default context dict for the admin site."""

    return {**admin.site.each_context(request), **(extra_context or {})}

