from rest_framework import generics

from apps.recommendations.models import BookRecommendation, BuddyRecommendation
from apps.recommendations.serializers import BookRecommendationSerializer, BuddyRecommendationSerializer

class BookRecommendationListView(generics.ListAPIView):
    """
    GET /api/recommendations/books/
    """

    serializer_class = BookRecommendationSerializer

    def get_queryset(self):
        return BookRecommendation.objects.filter(user=self.request.user).select_related('book').prefetch_related('book__authors')
    
class BuddyRecommendationListView(generics.ListAPIView):
    """
    GET /api/recommendations/buddies/
    """

    serializer_class = BuddyRecommendationSerializer

    def get_queryset(self):
        return BuddyRecommendation.objects.filter(from_user=self.request.user).select_related('to_user')