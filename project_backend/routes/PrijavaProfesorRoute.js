const express = require("express");
const PrijavaProfesor = require("../models/PrijavaProfesor");
const Program = require("../models/Program");
const Ustanova = require("../models/Ustanova");
const Uloga = require("../models/Uloga");
const { authenticateToken } = require("../controllers/authController");

const router = express.Router();

const checkProfessorRole = async (req, res, next) => {
  if (req.user.uloga !== "profesor") {
    return res.status(403).json({ message: "Access denied. Professors only." });
  }
  next();
};

router.post(
  "/submit",
  authenticateToken,
  checkProfessorRole,
  async (req, res) => {
    const { program, ustanova } = req.body;

    if (!program || !ustanova) {
      return res
        .status(400)
        .json({ message: "Program and Ustanova are required." });
    }

    try {
      const existingProgram = await Program.findById(program);
      if (!existingProgram) {
        return res.status(404).json({ message: "Program not found." });
      }

      const existingUstanova = await Ustanova.findById(ustanova);
      if (!existingUstanova) {
        return res.status(404).json({ message: "Ustanova not found." });
      }

      const newApplication = new PrijavaProfesor({
        program: existingProgram._id,
        ustanova: existingUstanova._id,
        user: req.user.korisnik_id,
      });

      await newApplication.save();

      res.status(201).json({
        message: "Erasmus application submitted successfully.",
        application: newApplication,
      });
    } catch (err) {
      console.error("Error submitting application:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

module.exports = router;
