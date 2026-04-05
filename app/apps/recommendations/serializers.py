from rest_framework import serializers

from apps.books.serializers import BookSerializer
from apps.recommendations.models import BookRecommendation, BuddyRecommendation
from apps.users.models import User

class BookRecommendationSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)

    class Meta:
        model = BookRecommendation
        fields = ['id', 'book', 'score']

class BuddyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'bio', 'avatar_url']

class BuddyRecommendationSerializer(serializers.ModelSerializer):
    to_user = BuddyUserSerializer(read_only=True)

    class Meta:
        model = BuddyRecommendation
        fields = ['id', 'to_user', 'score']