from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.books.models import Review
from apps.recommendations.tasks import update_book_recommendations, update_buddy_recommendations

@receiver(post_save, sender=Review)
def on_review_saved(sender, instance, **kwargs):
    user_id: int = instance.shelf_entry.user_id
    if not settings.DJANGO_ENABLE_CELERY:
        return
    
    update_book_recommendations(user_id)
    update_buddy_recommendations(user_id)