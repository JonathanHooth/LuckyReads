
import requests


def fetch_book_from_openlibrary(openlibrary_key):
    response = requests.get(
        f'https://openlibrary.org{openlibrary_key}.json',
        timeout=10
    )
    if not response.ok:
        return None
    data = response.json()
    return {
        'title': data.get('title', ''),
        'cover_url': '',  # works endpoint doesn't return cover_i directly
        'authors': [a.get('name') for a in data.get('authors', [])]
    }