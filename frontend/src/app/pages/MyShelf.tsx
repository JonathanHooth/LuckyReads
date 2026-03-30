// change to absolute import
import BookCard from "../../components/BookCard";
import "./MyShelf.css";
//navbar
//pfp name
// all books, reading, read, want to read

export default function MyShelf() {
    const books = [
        {
            title: "Book Title",
            author: "Author Name",
            coverUrl:
                "https://covers.openlibrary.org/b/isbn/9780385472579-M.jpg",
            status: "Reading",
        },
        {
            title: "Book Title",
            author: "Author Name",
            coverUrl:
                "https://covers.openlibrary.org/b/isbn/9780385472579-M.jpg",
            status: "Reading",
        },
        {
            title: "Book Title",
            author: "Author Name",
            coverUrl:
                "https://covers.openlibrary.org/b/isbn/9780385472579-M.jpg",
            status: "Reading",
        },
        {
            title: "Book Title",
            author: "Author Name",
            coverUrl:
                "https://covers.openlibrary.org/b/isbn/9780385472579-M.jpg",
            status: "Reading",
        },
    ];
    return (
        <div className="my-shelf">
            <div className="my-shelf-container">
                <h1 className="profile-name">Jane Doe</h1>
                <div className="shelf-tabs">
                    <button className="shelf-tab">All</button>
                    <button className="shelf-tab">Reading</button>
                    <button className="shelf-tab">Read</button>
                    <button className="shelf-tab">Want to Read</button>
                </div>

                <div className="book-grid">
                    {books.map((book) => (
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
