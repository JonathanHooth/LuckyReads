import networkx as nx
from celery import shared_task
from django.db import transaction

from books.models import Review
from .models import BookRecommendation, BuddyRecommendation

_RATING_THRESHOLD = 3

def _build_graph() -> tuple[nx.Graph, dict[int, set[int]]]:
    reviews = (
        Review.objects
            .select_related('shelf_entry__user', 'shelf_entry__book')
            .filter(rating__gte=_RATING_THRESHOLD)
    )

    G = nx.Graph()
    shelf_book_ids: dict[int, set[int]] = {}

    for review in reviews:
        shelf_entry = review.shelf_entry
        user_node = f'user_{shelf_entry.user.pk}'
        book_node = f'book_{shelf_entry.book.pk}'

        assert review.rating is not None
        weight: float = (review.rating / 5) ** 2
        G.add_edge(user_node, book_node, weight=weight)

        shelf_book_ids.setdefault(shelf_entry.user.pk, set()).add(shelf_entry.book.pk)

    return G, shelf_book_ids

def _run_ppr(G, user_id):
    user_node = f'user_{user_id}'

    if user_node not in G:
        return
    
    personalization = {
        node: 1.0 if node == user_node else 0.0 
        for node in G.nodes()
    }

    return nx.pagerank(
        G,
        alpha=0.85,
        personalization=personalization,
        weight='weight'
    )

@shared_task
def update_book_recommendations(user_id: int) -> None:
    G, shelf_book_ids = _build_graph()
    scores = _run_ppr(G, user_id)

    if scores is None:
        return
    
    books_on_shelf: set = shelf_book_ids.get(user_id, set())

    book_scores: dict[int, float] = {
        int(node.split('_')[1]): score
        for node, score in scores.items()
        if node.startswith('book_')
        and int(node.split('_')[1] not in books_on_shelf)
    }

    with transaction.atomic():
        for book_id, score in book_scores.items():
            BookRecommendation.objects.update_or_create(
                user_id=user_id,
                book_id=book_id,
                defaults={'score': score}
            )

@shared_task
def update_buddy_recommendations(user_id: int) -> None:
    G, _ = _build_graph()
    scores = _run_ppr(G, user_id)

    if scores is None:
        return
    
    buddy_scores = {
        int(node.split('_')[1]): score
        for node, score in scores.items()
        if node.startswith('user_')
        and int(node.split('_')[1]) != user_id
    }

    with transaction.atomic():
        for to_user_id, score in buddy_scores.items():
            BuddyRecommendation.objects.update_or_create(
                from_user_id=user_id,
                to_user_id=to_user_id,
                defaults={'score': score}
            )