import { useState } from "react";
// change to absolute import
import Navbar from "../../components/Navbar/Navbar";
import BookCard from "../../components/BookCard/BookCard";
import "./MyShelf.css";

export default function MyShelf() {
    const [activeTab, setActiveTab] = useState("All Books");
    // list of Books for MVP
    const [books] = useState([
        {
            id: 1,
            isbn: "9780060935467",
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            status: "Want to Read",
        },
        {
            id: 2,
            isbn: "9780141439518",
            title: "Pride and Prejudice",
            author: "Jane Austen",
            status: "Reading",
        },
        {
            id: 3,
            isbn: "9780064404990",
            title: "Lion, the Witch, and the Wardrobe",
            author: "C.S. Lewis",
            status: "Reading",
        },
        {
            id: 4,
            isbn: "9780743273565",
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            status: "Read",
        },
        {
            id: 5,
            isbn: "9780553212471",
            title: "Frankenstein",
            author: "Mary Shelley",
            status: "Read",
        },
    ]);
    // TODO: add placeholder image for books without covers?
    const booksWithCovers = books.map((book) => ({
        ...book,
        coverUrl: book.isbn
            ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
            : undefined,
    }));

    const filteredBooks =
        activeTab === "All Books"
            ? booksWithCovers
            : booksWithCovers.filter((book) => book.status === activeTab);
    return (
        <div className="my-shelf">
            <Navbar />
            <div className="my-shelf-container">
                <h1 className="profile-name">Jane Doe's Shelf</h1>
                <div className="shelf-tabs">
                    <button
                        className={`shelf-tab ${activeTab === "All Books" ? "active" : ""}`}
                        onClick={() => setActiveTab("All Books")}
                    >
                        All Books
                    </button>
                    <button
                        className={`shelf-tab ${activeTab === "Reading" ? "active" : ""}`}
                        onClick={() => setActiveTab("Reading")}
                    >
                        Reading
                    </button>
                    <button
                        className={`shelf-tab ${activeTab === "Read" ? "active" : ""}`}
                        onClick={() => setActiveTab("Read")}
                    >
                        Read
                    </button>
                    <button
                        className={`shelf-tab ${activeTab === "Want to Read" ? "active" : ""}`}
                        onClick={() => setActiveTab("Want to Read")}
                    >
                        Want to Read
                    </button>
                </div>
                <div className="book-grid">
                    {filteredBooks.map((book) => (
                        <BookCard
                            key={book.title}
                            title={book.title}
                            author={book.author}
                            coverUrl={book.coverUrl}
                            status={book.status}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
