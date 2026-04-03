# LuckyReads API Cheat Sheet

This guide explains how frontend-to-backend API flow works in LuckyReads, what has already been set up, and how we should structure the next real endpoints.

## Purpose

Use this cheat sheet to align the team on:

- how the frontend talks to the backend
- where models fit into API requests
- what the next likely LuckyReads endpoints should be

### Frontend

- Axios is installed and configured with a shared API client
- frontend API calls use a clean `/api/...` path pattern
- Vite proxies `/api` requests to the Django backend during local development

### Backend

- Django exposes a simple health endpoint at `/api/health/`
- that endpoint returns JSON and is used to verify the frontend↔backend connection

### Verified Locally

These two requests both work in local development:

```sh
curl http://127.0.0.1:9000/api/health/
curl http://localhost:5173/api/health/
```

Both return:

```json
{"status": 200, "message": "Systems operational."}
```

## Why We Use the Vite Proxy

In local development:

- the frontend runs on one port
- the backend runs on another port

Instead of hardcoding backend URLs everywhere in the frontend, Vite proxies `/api/...` requests to Django.

That gives us a cleaner frontend setup because:

- frontend code can call `/api/...` instead of `http://localhost:9000/...`
- local development is easier to maintain
- the request pattern stays consistent across frontend code

## The API Flow

This is the standard request flow we should use in LuckyReads:

```text
React page/component
  -> Axios API function
  -> /api/... endpoint
  -> Django/DRF view
  -> model/database logic
  -> JSON response
  -> React UI update
```

## Important Rule

The frontend never talks directly to the database.

Instead:

- frontend talks to backend endpoints
- backend views talk to models
- models talk to the database

## Current Working Example

### Frontend request

```ts
await apiClient.get("/health/");
```

Because the Axios client uses `/api` as its base URL, the actual request becomes:

```text
/api/health/
```

### Backend route

```python
path("api/health/", views.health_check, name="api-health")
```

### Backend response

```json
{"status": 200, "message": "Systems operational."}
```

## LuckyReads Models We Will Likely Connect Next

### Users

File: [app/apps/users/models.py]

Relevant fields:

- `username`
- `email`
- `bio`
- `avatar_url`

### Books

File: [app/apps/books/models.py]

Relevant models:

- `Author`
- `Book`
- `ShelfEntry`
- `Review`

### Recommendations

File: [app/apps/recommendations/models.py]

Relevant models:

- `BookRecommendation`
- `BuddyRecommendation`


## LuckyReads API Use Cases

Below are the most likely next API use cases based on the current project and MVP direction.

### 1. Login

Frontend:

```ts
await apiClient.post("/auth/login/", {
  email,
  password,
});
```

Backend should:

- validate credentials
- authenticate the user
- return success and auth info

### 2. Register / Create Reader Profile

Frontend:

```ts
await apiClient.post("/auth/register/", {
  email,
  password,
  confirm_password,
});
```

Backend should:

- validate fields
- create a `User`
- return created user data

### 3. Save Onboarding Data

Frontend:

```ts
await apiClient.post("/profile/onboarding/", {
  name,
  bio,
  favorite_genres,
  favorite_books,
  reading_goal,
});
```

Backend should:

- update the current user
- store onboarding/profile data
- return saved profile data

### 4. Get Current User Profile

Frontend:

```ts
await apiClient.get("/profile/me/");
```

Backend should:

- load the current authenticated user
- return profile JSON

Generic route patterns to use:

- current logged-in user: `/api/profile/me/`
- specific user by id: `/api/users/<id>/`

Avoid personal-name URLs such as `/api/users/someone-name/` unless the product intentionally uses usernames in routes.

### 5. Get Books

Frontend:

```ts
await apiClient.get("/books/");
```

Optional search example:

```ts
await apiClient.get("/books/", {
  params: { q: "Fourth Wing" },
});
```

Backend should:

- query the `Book` model
- return a list of books

### 6. Add Book to Shelf

Frontend:

```ts
await apiClient.post("/shelf/", {
  book_id,
  status: "want_to_read",
});
```

Backend should:

- create or update a `ShelfEntry`

### 7. Get User Shelf

Frontend:

```ts
await apiClient.get("/shelf/");
```

Backend should:

- fetch the current user's `ShelfEntry` records
- return shelf items with book details

### 8. Save Review

Frontend:

```ts
await apiClient.post("/reviews/", {
  shelf_entry_id,
  rating,
  review_text,
});
```

Backend should:

- create or update a `Review`

### 9. Get Recommendations

Frontend:

```ts
await apiClient.get("/recommendations/books/");
await apiClient.get("/recommendations/buddies/");
```

Backend should:

- query `BookRecommendation`
- query `BuddyRecommendation`


Backend should:

- fetch conversations
- fetch messages
- create messages

## How Models Connect to the API

Models do not connect directly to Axios.

The connection works like this:

1. frontend sends a request with Axios
2. backend endpoint receives the request
3. backend view or DRF view queries models
4. models read or write database data
5. backend returns JSON
6. frontend renders the response

## How Backend Functions Get Called

Specific backend helper functions can absolutely be used, but the frontend does not call them directly.

Instead, the frontend calls an API endpoint, and the backend view calls the helper function internally.

The flow looks like this:

```text
Frontend
  -> API endpoint
  -> Django/DRF view
  -> backend helper/service/model function
  -> database
  -> JSON response
```

### Example

Frontend:

```ts
await apiClient.post("/profile/onboarding/", {
  name,
  bio,
  favorite_genres,
});
```

Backend view:

```python
def onboarding_view(request):
    data = request.data
    create_profile(request.user, data)
    return Response({"ok": True})
```

Backend helper function:

```python
def create_profile(user, data):
    user.bio = data.get("bio", "")
    user.save()
```

### Example: Fetching books from the database

Backend view:

```python
from django.http import JsonResponse
from apps.books.models import Book

def book_list(request):
    books = Book.objects.all().values("id", "title", "cover_url")
    return JsonResponse({"books": list(books)})
```

Backend route:

```python
path("api/books/", views.book_list, name="book-list")
```

Frontend API function:

```ts
import { apiClient } from "./client";

export async function fetchBooks() {
  const { data } = await apiClient.get("/books/");
  return data;
}
```

## What Backend Usually Needs for a Real Feature

For a real API feature, backend work usually includes:

- a URL route in `urls.py`
- a view in `views.py`
- often a serializer if using DRF
- model queries or updates
- a JSON response

## What Frontend Usually Needs for a Real Feature

For a real API feature, frontend work usually includes:

- one function in `frontend/src/api/...`
- one component/page call site
- loading state
- success handling
- error handling

## Recommended Next Endpoints

The next most useful endpoints for LuckyReads are probably:

- `/api/auth/register/`
- `/api/auth/login/`
- `/api/profile/me/`
- `/api/profile/onboarding/`
- `/api/books/`
- `/api/shelf/`
- `/api/recommendations/books/`

## Best Practices for This Project

- keep frontend requests under `/api/...`
- use the shared Axios client
- use DRF for real endpoints that need validation and structured JSON
- keep responses predictable and frontend-friendly
- start small with one endpoint per feature
