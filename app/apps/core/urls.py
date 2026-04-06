from django.urls import path
from django.views.generic import RedirectView

from . import views

app_name = "core"

urlpatterns = [
    path("", RedirectView.as_view(url="/admin"), name="index"),
    path("health/", views.health_check, name="health"),
    path("api/health/", views.health_check, name="api-health"),
    path("admin/sysinfo/", views.sys_info, name="sysinfo"),
]
