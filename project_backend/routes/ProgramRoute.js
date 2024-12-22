const express = require("express");

const Program = require("../models/Program");
const { authenticateToken } = require("../controllers/authController");

const router = express.Router();

router
  .get("/", authenticateToken, async (req, res) => {
    try {
      const programs = await Program.find();
      res.status(200).json({ success: true, data: programs });
    } catch (err) {
      console.error("Error fetching programs:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  })
  .get("/by-role", authenticateToken, async (req, res) => {
    try {
      const { uloga } = req.user;
      let programs;

      if (uloga === "admin") {
        programs = await Program.find();
      } else if (uloga === "profesor") {
        programs = await Program.find({ tip: "profesor" });
      } else if (uloga === "student") {
        programs = await Program.find({ tip: "student" });
      } else {
        return res.status(403).json({ message: "Access denied." });
      }

      res.status(200).json({ success: true, data: programs });
    } catch (err) {
      console.error("Error fetching programs by role:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
module.exports = router;
