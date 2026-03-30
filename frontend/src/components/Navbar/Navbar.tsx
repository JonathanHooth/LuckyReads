import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            {/* TODO: Add the actual logo to the navbar */}
            <div className="navbar-logo">LuckyReads</div>
            <div className="navbar-links">
                <NavLink to="/home" className="navbar-link">
                    Home
                </NavLink>
                <NavLink to="/my-shelf" className="navbar-link">
                    My Shelf
                </NavLink>
                <NavLink to="/find-readers" className="navbar-link">
                    Find Readers
                </NavLink>
                <NavLink to="/messages" className="navbar-link">
                    Messages
                </NavLink>
                {/* TODO: add profile and logout option */}
            </div>
        </nav>
    );
}
