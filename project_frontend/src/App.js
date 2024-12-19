// /frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css'; // Import the CSS for styling

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <header className="app-header">
                    <h1>Erasmus Mobility Program</h1>
                    <nav className="navbar">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                    </nav>
                </header>

                <main className="main-content">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </main>

                <footer className="app-footer">
                    <p>© 2024 Erasmus Mobility Program</p>
                </footer>
            </div>
        </Router>
    );
};

export default App;
