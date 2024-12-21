const express = require("express");
const router = express.Router();
const Prijava = require("../models/Prijava");
const Ustanova = require("../models/Ustanova");
const Drzava = require("../models/Drzava");
const Korisnik = require("../models/Korisnik");
const { authenticateToken } = require("../controllers/authController");  // Destructure the correct export

// POST route for applications
router.post("/", authenticateToken, async (req, res) => {
    try {
        const {
            gpa,
            firstMobility,
            motivationLetter,
            englishProficiency,
            destinationLanguage,
            initiatedLLP,
            institution,
            countrySelected,
        } = req.body;

        const userId = req.user.korisnik_id; // User ID from the authenticated user

        // Validate the required fields...
        if (isNaN(gpa) || gpa < 3.0 || gpa > 5.0) {
            return res.status(400).json({ message: "Invalid GPA provided." });
        }

        if (
            firstMobility === null ||
            motivationLetter === null ||
            englishProficiency === null ||
            destinationLanguage === null ||
            initiatedLLP === null ||
            !institution // Check if institution is provided
        ) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Calculate the final score
        const weights = {
            firstMobility: 15,
            motivationLetter: 2,
            englishProficiency: 2,
            destinationLanguage: 1,
            initiatedLLP: 1,
        };

        let score = 0;

        // Add weights if 'Yes' (true)
        if (firstMobility) score += weights.firstMobility;
        if (motivationLetter) score += weights.motivationLetter;
        if (englishProficiency) score += weights.englishProficiency;
        if (destinationLanguage) score += weights.destinationLanguage;
        if (initiatedLLP) score += weights.initiatedLLP;

        // Add GPA score
        score += parseFloat(gpa) * 8;

        // Create and save the application
        const application = new Prijava({
            gpa,
            firstMobility,
            motivationLetter,
            englishProficiency,
            destinationLanguage,
            initiatedLLP,
            ustanova: institution,  // Save institution as 'ustanova'
            user: userId,  // Store the logged-in user's ID
        });
        await application.save();

        res.status(201).json({
            message: "Application submitted successfully!",
            finalScore: score,
        });
    } catch (error) {
        console.error("Error processing the request:", error);
        res.status(500).json({ message: "An error occurred while processing the application." });
    }
});

// Endpoint to get countries
router.get("/countries", authenticateToken, async (req, res) => {
    try {
        const countries = await Drzava.find({}, { naziv: 1, _id: 0 });
        const countryNames = countries.map((country) => country.naziv);

        res.status(200).json(countryNames); // Send all countries without filtering
    } catch (error) {
        console.error("Error fetching countries:", error);
        res.status(500).json({ message: "Error fetching countries." });
    }
});

// Endpoint for getting institutions from countries
router.get("/institutions/:country", async (req, res) => {
    try {
        const { country } = req.params; // country name is passed in the URL
        const drzava = await Drzava.findOne({ naziv: country });  // Find country by name

        if (!drzava) {
            return res.status(404).json({ message: `Country ${country} not found` });
        }

        const institutions = await Ustanova.find({ drzava: drzava._id }).populate('drzava', 'naziv');
        res.status(200).json(institutions);
    } catch (error) {
        console.error("Error fetching institutions:", error);
        res.status(500).json({ message: "Error fetching institutions." });
    }
});

module.exports = router;
