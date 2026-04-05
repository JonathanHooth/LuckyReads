from rest_framework import serializers

from apps.core.abstracts.serializers import ModelSerializer
from apps.books.models import Author, Book, Review, ShelfEntry
from apps.books.services import get_or_fetch_book

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
    openlibrary_key = serializers.CharField(write_only=True)
    review = ReviewSerializer(read_only=True)

    class Meta:
        model = ShelfEntry
        fields = ['id', 'book', 'openlibrary_key', 'status', 'review', 'added_at']
        read_only_fields = ['id', 'added_at']

    def create(self, validated_data: dict) -> ShelfEntry:
        openlibrary_key = validated_data.pop('openlibrary_key')
        book = get_or_fetch_book(openlibrary_key)
        validated_data['user'] = self.context['request'].user
        validated_data['book'] = book
        return super().create(validated_data)