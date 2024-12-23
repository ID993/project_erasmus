// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/Auth"); // Import auth routes
const applicationRoutes = require("./routes/Application"); // Import application routes
const countriesRoutes = require("./routes/Countries"); // Import countries route
const programRoutes = require("./routes/ProgramRoute");
const ustanovaRoutes = require("./routes/UstanovaRoute");
const profesorPrijava = require("./routes/PrijavaProfesorRoute");
const prijavaRoutes = require("./routes/PrijavaRoute");

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

// Countries route
app.use("/api/countries", countriesRoutes); // Register the countries route

app.use("/api/ustanove", ustanovaRoutes);
app.use("/api/programi", programRoutes);

app.use("/api/professor-application", profesorPrijava);

app.use("/api/application", prijavaRoutes);

// Listen on port 5000
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
