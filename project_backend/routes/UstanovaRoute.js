const express = require("express");

const Ustanova = require("../models/Ustanova");
const Korisnik = require("../models/Korisnik");
const { authenticateToken } = require("../controllers/authController");

const router = express.Router();

router
  .get("/", authenticateToken, async (req, res) => {
    try {
      const ustanovas = await Ustanova.find();
      res.status(200).json({ success: true, data: ustanovas });
    } catch (err) {
      console.error("Error fetching ustanovas:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  })
  .get("/not-from", authenticateToken, async (req, res) => {
    try {
      const { email } = req.user;
      const user = await Korisnik.findOne({ email });
      const userUstanovaId = user.ustanova;
      if (!userUstanovaId) {
        return res
          .status(400)
          .json({ message: "User ustanova not found in token." });
      }

      const userUstanova = await Ustanova.findById(userUstanovaId).populate(
        "drzava"
      );
      if (!userUstanova) {
        return res.status(404).json({ message: "User's ustanova not found." });
      }

      const userDrzavaId = userUstanova.drzava._id;

      const ustanovas = await Ustanova.find({ drzava: { $ne: userDrzavaId } });

      res.status(200).json({ success: true, data: ustanovas });
    } catch (err) {
      console.error("Error fetching ustanovas:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });

module.exports = router;
