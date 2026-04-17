import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./FindReaders.css";

function SearchIcon() {
    return (
        <svg
            aria-hidden="true"
            className="find-readers-search__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </svg>
    );
}

interface Reader {
    id: string;
    name: string;
    avatar?: string;
    favoriteGenres?: string[];
    booksRead?: number;
}

export default function FindReaders() {
    const [searchQuery, setSearchQuery] = useState("");
    const [readers, setReaders] = useState<Reader[]>([]);

    return (
        <div className="find-readers-page">
            <Navbar />
            <div className="find-readers-shell">
                <section className="find-readers-hero">
                    <div className="find-readers-hero__content">
                        <h1 className="find-readers-hero__title">
                            Find Your Book Buddies
                        </h1>
                        <p className="find-readers-hero__subtitle">
                            Connect with readers who share your taste in books
                        </p>
                    </div>
                </section>

                <section className="find-readers-search-section">
                    <div className="find-readers-search-box">
                        <SearchIcon />
                        <input
                            type="text"
                            className="find-readers-search__input"
                            placeholder="Search for readers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </section>

                <section className="find-readers-results">
                    <h2 className="find-readers-results__title">
                        Readers You Might Like
                    </h2>
                    {readers.length > 0 ? (
                        <div className="readers-grid">
                            {readers.map((reader) => (
                                <div key={reader.id} className="reader-card">
                                    <div className="reader-card__avatar">
                                        {reader.name.charAt(0)}
                                    </div>
                                    <h3 className="reader-card__name">
                                        {reader.name}
                                    </h3>
                                    {reader.booksRead && (
                                        <p className="reader-card__stat">
                                            {reader.booksRead} books read
                                        </p>
                                    )}
                                    {reader.favoriteGenres && (
                                        <div className="reader-card__genres">
                                            {reader.favoriteGenres.map((genre) => (
                                                <span
                                                    key={genre}
                                                    className="genre-tag"
                                                >
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <button className="reader-card__follow-btn">
                                        Follow
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="find-readers-empty-state">
                            <p>No readers are available yet.</p>
                            <p>Try refining your search or check back later.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
