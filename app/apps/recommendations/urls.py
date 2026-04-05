from django.urls import path

from apps.recommendations import views

urlpatterns = [
    path('recommendations/books/', views.BookRecommendationListView.as_view(), name='book-recommendations'),
    path('recommendations/buddies/', views.BuddyRecommendationListView.as_view(), name='buddy-recommendations'),
]