import "./BookCard.css";

type BookCardProps = {
    title: string;
    author: string;
    coverUrl?: string;
    status: string;
};

export default function BookCard(props: BookCardProps) {
    return (
        <div className="book-card">
            {/* consider using a placeholder image if coverUrl is not provided */}
            <img
                className="book-card-cover"
                src={props.coverUrl || "placeholder"}
                alt="Book cover"
            />
            <div className="book-card-info">
                <h3 className="book-card-title">{props.title}</h3>
                <p className="book-card-author">{props.author}</p>
                <select
                    className="book-card-status"
                    defaultValue={props.status}
                >
                    <option value="Want to Read">Want to Read</option>
                    <option value="Reading">Reading</option>
                    <option value="Read">Read</option>
                </select>
            </div>
        </div>
    );
}
