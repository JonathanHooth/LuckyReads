import type { DisplayBook } from "./books";

export const mockRecommendations: DisplayBook[] = [
    {
        id: "mock-rec-1",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780060935467-M.jpg",
        genres: ["Classics", "Literary Fiction"],
        matchPercentage: 94,
    },
    {
        id: "mock-rec-2",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg",
        genres: ["Romance", "Classics"],
        matchPercentage: 91,
    },
    {
        id: "mock-rec-3",
        title: "Lion, the Witch, and the Wardrobe",
        author: "C.S. Lewis",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780064404990-M.jpg",
        genres: ["Fantasy", "Adventure"],
        matchPercentage: 88,
    },
    {
        id: "mock-rec-4",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg",
        genres: ["Classics", "Historical"],
        matchPercentage: 86,
    },
    {
        id: "mock-rec-5",
        title: "Frankenstein",
        author: "Mary Shelley",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9780553212471-M.jpg",
        genres: ["Gothic", "Science Fiction"],
        matchPercentage: 89,
    },
    {
        id: "mock-rec-6",
        title: "Beloved",
        author: "Toni Morrison",
        coverUrl: "https://covers.openlibrary.org/b/isbn/9781400033416-M.jpg",
        genres: ["Literary Fiction", "Historical"],
        matchPercentage: 93,
    },
];
