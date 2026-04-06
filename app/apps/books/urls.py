from django.urls import path

from apps.books import views

urlpatterns = [
    path('', views.BookListView.as_view(), name='book-list'),
    path('olsearch/', views.OpenLibrarySearchView.as_view(), name='book-olsearch'),
    path('reviews/', views.ReviewView.as_view(), name='reviews'),
    path('shelf/', views.ShelfView.as_view(), name='shelf')
]