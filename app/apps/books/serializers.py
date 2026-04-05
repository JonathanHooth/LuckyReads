from rest_framework import serializers

from apps.core.abstracts.serializers import ModelSerializer
from apps.books.models import Author, Book, Review, ShelfEntry

class AuthorSerializer(ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'openlibrary_key', 'name', 'photo_url']

class BookSerializer(ModelSerializer):
    authors = AuthorSerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'openlibrary_key', 'title', 'authors', 'cover_url', 'isbn']

class ReviewSerializer(ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'rating', 'review_text', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ShelfEntrySerializer(ModelSerializer):
    book = BookSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(), source='book', write_only=True
    )
    review = ReviewSerializer(read_only=True)

    class Meta:
        model = ShelfEntry
        fields = ['id', 'book_id', 'book', 'status', 'review', 'added_at', 'updated_at']
        read_only_fields = ['id', 'added_at', 'updated_at']

    def create(self, validated_data: dict) -> ShelfEntry:
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)