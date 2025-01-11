// routes/Countries.js
const express = require("express");
const router = express.Router();
const Drzava = require("../models/Drzava");
const Ustanova = require("../models/Ustanova");
const Korisnik = require("../models/Korisnik");
const { authenticateToken } = require("../controllers/authController");

// Route to get all countries (drzave)
router.get("/", async (req, res) => {
  //console.log('Fetching countries...');
  try {
    const drzave = await Drzava.find();
    //console.log('Fetched countries:', drzave);  // Log fetched countries
    res.json(drzave);
  } catch (err) {
    console.error("Error fetching countries:", err);
    res.status(500).json({ message: "Failed to fetch countries" });
  }
});

router.get("/not-from", authenticateToken, async (req, res) => {
  try {
    const { korisnik_id, email } = req.user;
    //console.log(korisnik_id);
    //const user = await Korisnik.findOne({ email }).populate("ustanova");
    const user = await Korisnik.findById(korisnik_id).populate("ustanova");
    const drzave = await Drzava.find();

    const userUstanovaId = user.ustanova._id;
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
    //console.log(userDrzavaId);
    const drzavas = await Drzava.find({ _id: { $ne: userDrzavaId } });
    res.json(drzavas);
  } catch (err) {
    console.error("Error fetching countries:", err);
    res.status(500).json({ message: "Failed to fetch countries" });
  }
});

module.exports = router;
