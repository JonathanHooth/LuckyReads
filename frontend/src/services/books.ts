import { apiClient } from "../api/client";

type ApiAuthor = {
    name?: string | null;
};

type ApiBook = {
    id?: number | string;
    openlibrary_key?: string | null;
    title?: string | null;
    authors?: ApiAuthor[] | null;
    cover_url?: string | null;
};

type ApiRecommendation = {
    id?: number | string;
    book?: ApiBook | null;
    score?: number | null;
};

export type DisplayBook = {
    id: string;
    title: string;
    author: string;
    coverUrl?: string;
    matchPercentage?: number;
};

function mapBook(book: ApiBook, recommendation?: ApiRecommendation): DisplayBook {
    const authors = Array.isArray(book.authors)
        ? book.authors
              .map((author) => author.name?.trim())
              .filter((name): name is string => Boolean(name))
        : [];
    const rawScore = recommendation?.score;
    const matchPercentage =
        typeof rawScore === "number"
            ? Math.max(
                  0,
                  Math.min(
                      100,
                      rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore),
                  ),
              )
            : undefined;

    return {
        id: String(
            recommendation?.id ??
                book.id ??
                book.openlibrary_key ??
                book.title ??
                "book-card",
        ),
        title: book.title?.trim() || "Untitled book",
        author: authors.join(", ") || "Unknown author",
        coverUrl: book.cover_url?.trim() || undefined,
        matchPercentage,
    };
}

export async function fetchRecommendations(): Promise<DisplayBook[]> {
    const response = await apiClient.get<ApiRecommendation[]>("/recommendations/books/");
    return response.data.map((item) => mapBook(item.book ?? {}, item));
}

export async function searchBooks(query: string): Promise<DisplayBook[]> {
    const response = await apiClient.get<ApiBook[]>("/books/", {
        params: { search: query },
    });

    return response.data.map((book) => mapBook(book));
}
