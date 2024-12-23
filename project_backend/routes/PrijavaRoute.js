const express = require("express");
const Prijava = require("../models/Prijava");
const PrijavaProfesor = require("../models/PrijavaProfesor");
const { authenticateToken } = require("../controllers/authController");

const router = express.Router();

router.get("/all-applications", authenticateToken, async (req, res) => {
  try {
    const { uloga, korisnik_id } = req.user;
    let data = [];

    if (uloga === "admin") {
      const prijave = await Prijava.find().populate(
        "user",
        "ime prezime email"
      );
      const prijaveProfesor = await PrijavaProfesor.find().populate(
        "user",
        "ime prezime email"
      );
      data = { prijave, prijaveProfesor };
    } else if (uloga === "profesor") {
      data = await PrijavaProfesor.find({ user: korisnik_id }).populate(
        "user",
        "ime prezime email"
      );
    } else if (uloga === "student") {
      data = await Prijava.find({ user: korisnik_id }).populate(
        "user",
        "ime prezime email"
      );
    } else {
      return res.status(403).json({ message: "Access denied." });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error fetching applications by role:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
