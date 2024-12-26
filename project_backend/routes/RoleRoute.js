const express = require("express");
const router = express.Router();
const Uloga = require("../models/Uloga");

router.get("/", async (req, res) => {
  try {
    const uloge = await Uloga.find();

    res.json(uloge);
  } catch (err) {
    console.error("Error fetching roles:", err);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
});

module.exports = router;
