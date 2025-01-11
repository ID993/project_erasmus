import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Application from "./pages/Application";
import Dashboard from "./pages/Dashboard";
import AllApplications from "./pages/AllApplications";
import UserProfile from "./pages/UserProfile";
import UserList from "./pages/UserList";
import Institutions from "./pages/InstitutionsList";
import InstitutionDetails from "./pages/InstitutionDetails";
import EditInstitution from "./pages/EditInstitution";
import AddInstitution from "./pages/AddInstitution";
import Home from "./pages/Home";
import SetApplicationPeriod from "./pages/SetApplicationPeriod";
import AddAdminUser from "./pages/AddAdminUser";

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
    navigate("/"); // Redirect to homepage after logging out
  };

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <header className="app-header">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow-sm">
          <Link to="/" className="navbar-brand">
            Erasmus Mobility Program
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {(userRole === "student" || userRole === "profesor") && (
                    <li className="nav-item">
                      <Link to="/application" className="nav-link">
                        Send Application
                      </Link>
                    </li>
                  )}
                  {(userRole === "student" || userRole === "profesor") && (
                    <li className="nav-item">
                      <Link to="/institutions" className="nav-link">
                        All Institutions
                      </Link>
                    </li>
                  )}
                  {userRole === "admin" && (
                    <>
                      <li className="nav-item">
                        <Link to="/all-applications" className="nav-link">
                          All Applications
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/all-users" className="nav-link">
                          All Users
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/institutions" className="nav-link">
                          All Institutions
                        </Link>
                      </li>
                    </>
                  )}
                  {userRole !== "admin" && (
                    <li className="nav-item">
                      <Link to="/all-applications" className="nav-link">
                        My Applications
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <Link to={`/user-profile/${userId}`} className="nav-link">
                      My Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-link nav-link"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>
      <main className="main-content container py-4 flex-grow-1">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Dashboard /> : <Home />} />{" "}
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
          <Route
            path="/institution-details/:id"
            element={<InstitutionDetails />}
          />
          <Route path="/edit-institution/:id" element={<EditInstitution />} />
          <Route path="/add-institution" element={<AddInstitution />} />
          <Route path="/set-period" element={<SetApplicationPeriod />} />
          <Route path="/add-admin" element={<AddAdminUser />} />
        </Routes>
      </main>
      <footer className="bg-primary text-center py-3 mt-auto">
        <p className="mb-0 text-white">&copy; 2024 Erasmus Mobility Program</p>
      </footer>
    </div>
  );
};

export default App;
