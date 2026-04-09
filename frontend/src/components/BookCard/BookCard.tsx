import "./BookCard.css";

type BookStatus = "want_to_read" | "reading" | "read";

type BookCardProps = {
    title: string;
    author: string;
    coverUrl?: string;
    status: string;
    onStatusChange: (newStatus: BookStatus) => void;
};

export default function BookCard(props: BookCardProps) {
    return (
        <div className="book-card">
            {/* consider using a placeholder image if coverUrl is not provided */}
            <img
                className="book-card-cover"
                src={props.coverUrl || "placeholder"}
                alt={`${props.title} cover`}
            />
            <div className="book-card-info">
                <h3 className="book-card-title">{props.title}</h3>
                <p className="book-card-author">{props.author}</p>
                <select
                    value={props.status}
                    onChange={(e) =>
                        props.onStatusChange(e.target.value as BookStatus)
                    }
                    className="book-card-status"
                >
                    <option value="want_to_read">Want to Read</option>
                    <option value="reading">Reading</option>
                    <option value="read">Read</option>
                </select>
            </div>
        </div>
    );
}
