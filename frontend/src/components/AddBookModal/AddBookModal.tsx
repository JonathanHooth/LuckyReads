import { useState } from "react";
import { apiClient } from "../../api/client";
import "./AddBookModal.css";

type BookStatus = "want_to_read" | "reading" | "read";

type SearchResult = {
    openlibrary_key: string;
    title: string;
    authors?: string[];
    cover_url?: string;
};

type AddBookModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onAddBook: (openlibraryKey: string, status: BookStatus) => void;
};

export default function AddBookModal(props: AddBookModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [selectedStatus, setSelectedStatus] =
        useState<BookStatus>("want_to_read");

    if (!props.isOpen) {
        return null;
    }

    async function handleSearch() {
        if (!searchQuery.trim()) return;

        try {
            const response = await apiClient.get(
                `/books/olsearch/?q=${encodeURIComponent(searchQuery)}`,
            );
            setSearchResults(response.data);
        } catch (error) {
            console.error("Failed to search books:", error);
        }
    }
    async function handleAddClick(openlibraryKey: string) {
        try {
            await props.onAddBook(openlibraryKey, selectedStatus);
            resetModal();
            props.onClose();
        } catch (error) {
            console.error("Failed to add book:", error);
        }
    }

    function resetModal() {
        setSearchQuery("");
        setSearchResults([]);
        setSelectedStatus("want_to_read");
    }

    function handleClose() {
        resetModal();
        props.onClose();
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add a Book</h2>
                <div className="modal-row">
                    <input
                        type="text"
                        placeholder="Search by title or ISBN"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="modal-buttons">
                    <button onClick={handleSearch}>Search</button>
                    <button onClick={handleClose}>Close</button>
                </div>

                <div className="search-results">
                    {searchResults.map((result) => (
                        <div
                            key={result.openlibrary_key}
                            className="search-result-card"
                        >
                            <img
                                className="search-result-cover"
                                src={result.cover_url || "placeholder"}
                                alt={`${result.title} cover`}
                            />
                            <div className="search-result-info">
                                <h3 className="search-result-title">
                                    {result.title}
                                </h3>
                                <p className="search-result-author">
                                    {result.authors?.join(", ") ||
                                        "Unknown author"}
                                </p>
                                <button
                                    className="add-to-shelf-button"
                                    onClick={() =>
                                        handleAddClick(result.openlibrary_key)
                                    }
                                >
                                    Add to Shelf
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
