import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import BookCard from "../../components/books/BookCard";
import {
    fetchRecommendations,
    searchBooks,
    type DisplayBook,
} from "../../services/books";
import { mockRecommendations } from "../../services/mockRecommendations";
import { mockSearchResults } from "../../services/mockSearchResults";
import "./Home.css";

const FILTERS = ["All", "Books", "Authors"] as const;
const SEARCHABLE_FILTERS = new Set(["All", "Books"]);
const SKELETON_COUNT = 6;
const USE_MOCK_HOME_DATA = import.meta.env.VITE_USE_MOCK_HOME_DATA === "true";

type FilterOption = (typeof FILTERS)[number];

function SearchIcon() {
    return (
        <svg
            aria-hidden="true"
            className="home-search__icon"
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

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
    const [recommendations, setRecommendations] =
        useState<DisplayBook[]>(mockRecommendations);
    const [searchResults, setSearchResults] = useState<DisplayBook[]>([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [error, setError] = useState("");
    const [usingMockData, setUsingMockData] = useState(USE_MOCK_HOME_DATA);

    const trimmedQuery = searchQuery.trim();
    const hasSearchQuery = debouncedQuery.length > 0;
    const searchSupported = SEARCHABLE_FILTERS.has(activeFilter);

    useEffect(() => {
        let cancelled = false;

        async function loadRecommendations() {
            setLoadingRecommendations(true);
            setError("");

            if (USE_MOCK_HOME_DATA) {
                setRecommendations(mockRecommendations);
                setUsingMockData(true);
                setLoadingRecommendations(false);
                return;
            }

            try {
                const data = await fetchRecommendations();
                if (!cancelled) {
                    setRecommendations(
                        data.length > 0 ? data : mockRecommendations,
                    );
                    setUsingMockData(data.length === 0);
                }
            } catch (requestError) {
                if (!cancelled) {
                    setRecommendations(mockRecommendations);
                    setUsingMockData(true);
                    setError(
                        requestError instanceof Error
                            ? `${requestError.message} Showing sample recommendations while the API is in progress.`
                            : "Could not load recommendations right now.",
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingRecommendations(false);
                }
            }
        }

        loadRecommendations();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedQuery(trimmedQuery);
        }, 350);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [trimmedQuery]);

    useEffect(() => {
        if (!debouncedQuery) {
            setLoadingSearch(false);
            setSearchResults([]);
            setError("");
            return;
        }

        if (!searchSupported) {
            setLoadingSearch(false);
            setSearchResults([]);
            setError("");
            return;
        }

        let cancelled = false;

        async function runSearch() {
            setLoadingSearch(true);
            setError("");

            if (USE_MOCK_HOME_DATA) {
                const filteredMockResults = mockSearchResults.filter((book) => {
                    const haystack = `${book.title} ${book.author}`.toLowerCase();
                    return haystack.includes(debouncedQuery.toLowerCase());
                });
                setSearchResults(filteredMockResults);
                setUsingMockData(true);
                setLoadingSearch(false);
                return;
            }

            try {
                const data = await searchBooks(debouncedQuery);
                if (!cancelled) {
                    setSearchResults(data);
                    setUsingMockData(false);
                }
            } catch (requestError) {
                if (!cancelled) {
                    const filteredMockResults = mockSearchResults.filter((book) => {
                        const haystack =
                            `${book.title} ${book.author}`.toLowerCase();
                        return haystack.includes(debouncedQuery.toLowerCase());
                    });
                    setSearchResults(filteredMockResults);
                    setUsingMockData(true);
                    setError(
                        requestError instanceof Error
                            ? `${requestError.message} Showing sample search results while the API is in progress.`
                            : "Search is unavailable right now.",
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingSearch(false);
                }
            }
        }

        runSearch();

        return () => {
            cancelled = true;
        };
    }, [debouncedQuery, searchSupported]);

    const heading = hasSearchQuery ? "Search Results" : "Recommended For You";
    const cards = hasSearchQuery ? searchResults : recommendations;
    const isLoading = hasSearchQuery ? loadingSearch : loadingRecommendations;

    const helperMessage = useMemo(() => {
        if (!hasSearchQuery || searchSupported) {
            return "";
        }

        return `${activeFilter} search is not connected yet. Try All or Books for now.`;
    }, [activeFilter, hasSearchQuery, searchSupported]);

    return (
        <div className="home-page">
            <Navbar />

            <section className="home-hero">
                <div className="home-shell">
                    <div className="home-hero__content">
                        <h1 className="home-hero__title">
                            What will you read next?
                        </h1>

                        <label className="home-search" aria-label="Search books">
                            <SearchIcon />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.target.value)
                                }
                                placeholder="Search for books, authors, or readers..."
                            />
                        </label>

                        <div
                            className="home-filters"
                            role="tablist"
                            aria-label="Search filters"
                        >
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    className={
                                        filter === activeFilter
                                            ? "home-filter home-filter--active"
                                            : "home-filter"
                                    }
                                    onClick={() => setActiveFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <main className="home-content">
                <div className="home-shell">
                    <section className="home-results">
                        <div className="home-results__header">
                            <h2 className="home-results__title">{heading}</h2>

                            {hasSearchQuery ? (
                                <p className="home-results__subtitle">
                                    Showing results for "{debouncedQuery}"
                                </p>
                            ) : null}

                            {usingMockData ? (
                                <p className="home-results__meta">
                                    Using sample data for frontend development.
                                </p>
                            ) : null}
                        </div>

                        {helperMessage ? (
                            <div className="home-state home-state--empty">
                                <p>{helperMessage}</p>
                            </div>
                        ) : null}

                        {!helperMessage && error ? (
                            <div className="home-state home-state--error" role="alert">
                                <p>{error}</p>
                            </div>
                        ) : null}

                        {!helperMessage && isLoading ? (
                            <div className="home-grid" aria-hidden="true">
                                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                                    <div key={index} className="home-card-skeleton" />
                                ))}
                            </div>
                        ) : null}

                        {!helperMessage && !error && !isLoading && cards.length === 0 ? (
                            <div className="home-state home-state--empty">
                                <p>No results found.</p>
                                <p>Try a different title, author, or keyword.</p>
                            </div>
                        ) : null}

                        {!helperMessage && !error && !isLoading && cards.length > 0 ? (
                            <div className="home-grid">
                                {cards.map((book) => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>
                        ) : null}
                    </section>
                </div>
            </main>
        </div>
    );
}
