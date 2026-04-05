from rest_framework import filters, generics, status
from rest_framework.response import Response

from apps.books.models import Book, Review, ShelfEntry
from apps.books.serializers import BookSerializer, ReviewSerializer, ShelfEntrySerializer

class BookListView(generics.ListAPIView):
    """
    GET /api/books/
    GET /api/books/?q=<title>
    """

    serializer_class = BookSerializer
    queryset = Book.objects.prefetch_related('authors').all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'authors__name']

class ReviewView(generics.RetrieveUpdateDestroyAPIView):
    """
    POST /api/reviews
    """

    serializer_class = ShelfEntrySerializer

    def create(self, request, *args, **kwargs):
        shelf_entry_id = request.data.get('shelf_entry_id')
        review, created = Review.objects.update_or_create(
            shelf_entry_id=shelf_entry_id,
            defaults={
                'rating': request.data.get('rating'),
                'review_text': request.data.get('review_text', '')
            }
        )
        return Response(
            ReviewSerializer(review).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

class ShelfView(generics.ListCreateAPIView):
    """
    GET /api/shelf/
    POST /api/shelf/
    """

    serializer_class = ShelfEntrySerializer

    def get_queryset(self):
        return ShelfEntry.objects.filter(user=self.request.user).select_related('book', 'review').prefetch_related('book__authors')