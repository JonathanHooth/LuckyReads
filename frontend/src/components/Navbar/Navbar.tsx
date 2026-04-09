import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    const navItems = [
        { label: "Home", to: "/home" },
        { label: "My Shelf", to: "/my-shelf" },
        { label: "Find Readers", to: "/find-readers" },
    ];

    return (
        <nav className="navbar">
            <div className="navbar__inner">
                <div className="navbar-logo">LuckyReads</div>

                <div className="navbar-links">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                isActive
                                    ? "navbar-link navbar-link--active"
                                    : "navbar-link"
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="navbar-avatar" aria-label="User profile">
                    GG
                </div>
            </div>
        </nav>
    );
}
