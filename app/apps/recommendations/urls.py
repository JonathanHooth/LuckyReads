from django.urls import path

from apps.recommendations import views

urlpatterns = [
    path('books/', views.BookRecommendationListView.as_view(), name='book-recommendations'),
    path('buddies/', views.BuddyRecommendationListView.as_view(), name='buddy-recommendations'),
]