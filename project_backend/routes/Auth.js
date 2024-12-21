const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    getInstitutions,
    getRoles,
} = require("../controllers/authController"); // Import controller functions

const router = express.Router();

// Registration route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Fetch all institutions
router.get("/institutions", getInstitutions);

// Fetch all roles
router.get("/roles", getRoles);

// Logout
router.post("/logout", logoutUser);


module.exports = router;
