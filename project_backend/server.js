// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth"); // Import auth routes
const applicationRoutes = require("./routes/application"); // Import application routes

// This line ensures MongoDB connection is established when the server runs
require("./config/db"); // Import the MongoDB connection

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Root route (optional, just to handle requests to the base URL)
app.get("/", (req, res) => {
    res.send("Welcome to the backend API!");
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Application routes
app.use("/api/applications", applicationRoutes);

// Listen on port 5000
app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
});
