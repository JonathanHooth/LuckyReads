from django.urls import path

from apps.users import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='auth-register'),
    path('login/', views.LoginView.as_view(), name='auth-login'),
    path('profile/me/', views.ProfileMeView.as_view(), name='profile-me')
]