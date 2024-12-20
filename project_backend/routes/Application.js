// routes/application.js
const express = require("express");
const router = express.Router(); // Define the router here
const Prijava = require("../models/Prijava"); // Make sure to import your Application model

// POST route for applications
router.post("/", async (req, res) => {
  try {
    const {
      gpa,
      firstMobility,
      motivationLetter,
      englishProficiency,
      destinationLanguage,
      initiatedLLP,
    } = req.body;

    console.log("Received request with data:", req.body); // Log request body for debugging

    // Validate the required fields
    if (isNaN(gpa) || gpa < 3.0 || gpa > 5.0) {
      return res.status(400).json({ message: "Invalid GPA provided." });
    }
    if (
      firstMobility === null ||
      motivationLetter === null ||
      englishProficiency === null ||
      destinationLanguage === null ||
      initiatedLLP === null
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

    // Save the application to the database
    const application = new Prijava({
      gpa,
      firstMobility,
      motivationLetter,
      englishProficiency,
      destinationLanguage,
      initiatedLLP,
    });
    await application.save();

    console.log("Application saved:", application); // Log the saved application

    res.status(201).json({
      message: "Application submitted successfully!",
      finalScore: score,
    });
  } catch (error) {
    console.error("Error processing the request:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "An error occurred while processing the application." });
  }
});

module.exports = router;
