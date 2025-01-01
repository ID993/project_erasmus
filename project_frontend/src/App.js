import React, { useEffect, useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom"; // Use useNavigate here
import Login from "./pages/Login";
import Register from "./pages/Register";
import Application from "./pages/Application";
import Dashboard from "./pages/Dashboard";
import AllApplications from "./pages/AllApplications";
import UserProfile from "./pages/UserProfile";
import UserList from "./pages/UserList";
import Institutions from "./pages/InstitutionsList"; // Import Institutions page
import InstitutionDetails from "./pages/InstitutionDetails";
import EditInstitution from "./pages/EditInstitution"; // Import the edit page
import AddInstitution from "./pages/AddInstitution";

import "./App.css";

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1])); // Decode the token
    } catch (e) {
        return null;
    }
};

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate(); // Use useNavigate hook here
    const token = localStorage.getItem("token");

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const userId = token ? parseJwt(token).korisnik_id : null;
    const userRole = token ? parseJwt(token).uloga : null;

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/dashboard"); // Redirect to homepage after logging out
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Erasmus Mobility Program</h1>
                <nav className="navbar">
                    <div className="left-nav">
                        {!isLoggedIn && (
                            <>
                                <Link to="/login" className="nav-link">
                                    Login
                                </Link>
                                <Link to="/register" className="nav-link">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="right-nav">
                        {isLoggedIn ? (
                            <>
                                {(userRole === "student" || userRole === "profesor") && (
                                    <Link to="/application" className="nav-link">
                                        Send Application
                                    </Link>
                                )}

                                {userRole === "admin" && (
                                    <Link to="/all-applications" className="nav-link">
                                        All Applications
                                    </Link>
                                )}
                                {userRole === "admin" && (
                                    <Link to="/all-users" className="nav-link">
                                        All Users
                                    </Link>
                                )}
                                {userRole === "admin" && (
                                    <Link to="/institutions" className="nav-link">
                                        All Institutions
                                    </Link>
                                )}
                                {userRole !== "admin" && (
                                    <Link to="/all-applications" className="nav-link">
                                        My Applications
                                    </Link>
                                )}
                                <Link to={`/user-profile/${userId}`} className="nav-link">
                                    My Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="nav-link logout-btn"
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "inherit",
                                        cursor: "pointer",
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : null}
                    </div>
                </nav>
            </header>

            <main className="main-content">
                <Routes>
                    <Route
                        path="/login"
                        element={<Login setIsLoggedIn={setIsLoggedIn} />}
                    />
                    <Route path="/register" element={<Register />} />
                    <Route path="/application" element={<Application />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/all-applications" element={<AllApplications />} />
                    <Route path="/user-profile/:id" element={<UserProfile />} />
                    <Route path="/all-users" element={<UserList />} />
                    <Route path="/institutions" element={<Institutions />} />
                    <Route path="/institution-details/:id" element={<InstitutionDetails />} />
                    <Route path="/edit-institution/:id" element={<EditInstitution />} />
                    <Route path="/add-institution" element={<AddInstitution />} />
                </Routes>
            </main>

            <footer className="app-footer">
                <p>&copy; 2024 Erasmus Mobility Program</p>
            </footer>
        </div>
    );
};

export default App;
