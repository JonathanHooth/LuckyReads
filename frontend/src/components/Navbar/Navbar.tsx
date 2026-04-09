import { NavLink } from "react-router-dom";
import logo from "../../assets/luckyreadslogo_navbar.png";
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
                <NavLink to="/home" className="navbar-logo" aria-label="LuckyReads home">
                    <img src={logo} alt="LuckyReads" className="navbar-logo__image" />
                </NavLink>

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
