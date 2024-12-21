import React, { useEffect, useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";  // Use useNavigate here
import Login from "./pages/Login";
import Register from "./pages/Register";
import Application from "./pages/Application";
import Dashboard from "./pages/Dashboard";
import "./App.css";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate(); // Use useNavigate hook here

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/"); // Redirect to homepage after logging out
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Erasmus Mobility Program</h1>
                <nav className="navbar">
                    <div className="left-nav">
                        {!isLoggedIn && (
                            <>
                                <Link to="/login" className="nav-link">Login</Link>
                                <Link to="/register" className="nav-link">Register</Link>
                            </>
                        )}
                    </div>
                    <div className="right-nav">
                        {isLoggedIn ? (
                            <>
                                <Link to="/application" className="nav-link">Send Application</Link>
                                <button
                                    onClick={handleLogout}
                                    className="nav-link logout-btn"
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "inherit",
                                        cursor: "pointer",
                                    }}>
                                    Logout
                                </button>
                            </>
                        ) : null}
                    </div>
                </nav>
            </header>

            <main className="main-content">
                <Routes>
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/application" element={<Application />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </main>

            <footer className="app-footer">
                <p>© 2024 Erasmus Mobility Program</p>
            </footer>
        </div>
    );
};

export default App;
