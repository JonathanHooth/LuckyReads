import { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import Navbar from "../../components/Navbar/Navbar";
import BookCard from "../../components/BookCard/BookCard";
import "./MyShelf.css";
import AddBookModal from "../../components/AddBookModal/AddBookModal";

type BookStatus = "want_to_read" | "currently_reading" | "read";
type ShelfFilter = "all" | BookStatus;

type SearchResult = {
    openlibrary_key: string;
    title: string;
    authors?: string[];
    cover_url?: string;
};

type ShelfBook = {
    id: number;
    isbn: string;
    title: string;
    author: string;
    status: BookStatus;
    coverUrl?: string;
};

type ShelfEntry = {
    id: number;
    status: BookStatus;
    book?: {
        isbn: string;
        title: string;
        authors?: { name: string }[];
        cover_url?: string;
    };
};

export default function MyShelf() {
    const [activeTab, setActiveTab] = useState<ShelfFilter>("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [books, setBooks] = useState<ShelfBook[]>([]);

    useEffect(() => {
        fetchShelf();
    }, []);

    async function fetchShelf() {
        try {
            const response = await apiClient.get("/books/shelf/");

            const shelfEntries: ShelfEntry[] = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            const formattedBooks: ShelfBook[] = shelfEntries.map(
                (entry: ShelfEntry) => ({
                    id: entry.id,
                    isbn: entry.book?.isbn || "",
                    title: entry.book?.title || "Unknown title",
                    author:
                        entry.book?.authors
                            ?.map((author: any) => author.name)
                            .join(", ") || "Unknown author",
                    status: entry.status,
                    coverUrl: entry.book?.cover_url || undefined,
                }),
            );
            setBooks(formattedBooks);
        } catch (error) {
            console.error("Failed to fetch shelf:", error);
        }
    }

    async function handleAddBook(book: SearchResult, status: BookStatus) {
        try {
            await apiClient.post("/books/shelf/", {
                openlibrary_key: book.openlibrary_key,
                title: book.title,
                cover_url: book.cover_url || "",
                authors: book.authors || [],
                status,
            });
            await fetchShelf();
        } catch (error) {
            console.error("Failed to add book:", error);
        }
    }

    async function handleStatusChange(bookId: number, newStatus: BookStatus) {
        await apiClient.patch(`/books/shelf/${bookId}/`, { status: newStatus });
        await fetchShelf();
    }

    const filteredBooks =
        activeTab === "all"
            ? books
            : books.filter((book) => book.status === activeTab);

    return (
        <div className="my-shelf">
            <Navbar />
            <div className="my-shelf-container">
                <h1 className="my-shelf-title">My Shelf</h1>
                <div className="shelf-tabs">
                    <button
                        className={`shelf-tab ${activeTab === "all" ? "active" : ""}`}
                        onClick={() => setActiveTab("all")}
                    >
                        All Books
                    </button>
                    <button
                        className={`shelf-tab ${activeTab === "currently_reading" ? "active" : ""}`}
                        onClick={() => setActiveTab("currently_reading")}
                    >
                        Reading
                    </button>
                    <button
                        className={`shelf-tab ${activeTab === "read" ? "active" : ""}`}
                        onClick={() => setActiveTab("read")}
                    >
                        Read
                    </button>
                    <button
                        className={`shelf-tab ${activeTab === "want_to_read" ? "active" : ""}`}
                        onClick={() => setActiveTab("want_to_read")}
                    >
                        Want to Read
                    </button>
                </div>
                <div className="book-grid">
                    {filteredBooks.map((book) => (
                        <BookCard
                            key={book.id}
                            title={book.title}
                            author={book.author}
                            coverUrl={book.coverUrl}
                            status={book.status}
                            onStatusChange={(newStatus) =>
                                handleStatusChange(book.id, newStatus)
                            }
                        />
                    ))}
                </div>
                <div className="container">
                    <button
                        className="add-book-button"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Book
                    </button>
                </div>
                <AddBookModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAddBook={handleAddBook}
                />
            </div>
        </div>
    );
}
