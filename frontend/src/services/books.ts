import { apiClient } from "../api/client";

type ApiAuthor = {
    name?: string | null;
};

type ApiBook = {
    id?: number | string;
    title?: string | null;
    authors?: ApiAuthor[] | null;
    cover_url?: string | null;
    rating?: number | null;
    average_rating?: number | null;
    genres?: unknown;
    subjects?: unknown;
};

type ApiRecommendation = {
    id?: number | string;
    book?: ApiBook | null;
    score?: number | null;
    match_percentage?: number | null;
    match_reason?: string | null;
};

export type DisplayBook = {
    id: string;
    title: string;
    author: string;
    coverUrl?: string;
    matchPercentage?: number;
};

function normalizeGenres(value: unknown): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((genre) => {
            if (typeof genre === "string") {
                return genre;
            }

            if (
                genre &&
                typeof genre === "object" &&
                "name" in genre &&
                typeof genre.name === "string"
            ) {
                return genre.name;
            }

            return null;
        })
        .filter((genre): genre is string => Boolean(genre))
        .slice(0, 2);
}

function mapBook(book: ApiBook, recommendation?: ApiRecommendation): DisplayBook {
    const authors = Array.isArray(book.authors)
        ? book.authors
              .map((author) => author.name?.trim())
              .filter((name): name is string => Boolean(name))
        : [];
    const rawScore = recommendation?.match_percentage ?? recommendation?.score;
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
        id: String(recommendation?.id ?? book.id ?? book.title ?? "book-card"),
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
