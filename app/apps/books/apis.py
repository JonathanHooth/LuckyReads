"""
URL Patterns for books REST API.
"""

from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.books import views

router = DefaultRouter()
router.register("reviews", views.ReviewViewSet, basename="review")

app_name = "api-users"

urlpatterns = [
    path('', views.BookListView.as_view(), name='book-list'),
    path('olsearch/', views.OpenLibrarySearchView.as_view(), name='book-olsearch'),
    path('shelf/', views.ShelfView.as_view(), name='shelf'),
    *router.urls
]
