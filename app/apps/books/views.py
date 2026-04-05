import requests

from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from rest_framework import filters, generics, status
from rest_framework.views import APIView
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

class OpenLibrarySearchView(APIView):
    """
    GET /api/books/olsearch/?q=<title>
    """

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='q',
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
                description='Search query to find books on OpenLibrary'
            )
        ],
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT,
            502: OpenApiTypes.OBJECT
        }
    )
    def get(self, request) -> Response:
        query = request.query_params.get('q', '').strip()

        if not query:
            return Response(
                {'error': 'Search query is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = requests.get(
            'https://openlibrary.org/search.json',
            params={
                'q': query,
                'fields': 'key,title,author_name,cover_i',
                'limit': 10
            },
            timeout=10
        )

        if not response.ok:
            return Response(
                {'error': 'OpenLibrary search failed.'},
                status=status.HTTP_502_BAD_GATEWAY
            )
        
        results = [
            {
                'openlibrary_key': doc.get('key'),
                'title': doc.get('title'),
                'authors': doc.get('author_name', []),
                'cover_url': f'https://covers.openlibrary.org/b/id/{doc["cover_i"]}-M.jpg' if doc.get('cover_i') else ''
            } for doc in response.json().get('docs', [])
        ]

        return Response(results)

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