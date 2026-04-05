from django.urls import path

from apps.books import views

urlpatterns = [
    path('books/', views.BookListView.as_view(), name='book-list'),
    path('reviews/', views.ReviewView.as_view(), name='reviews'),
    path('shelf/', views.ShelfView.as_view(), name='shelf')
]