const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Korisnik = require("../models/Korisnik");
const { authenticateToken } = require("../controllers/authController");

const router = express.Router();

const adminCheck = (req, res, next) => {
  const userRole = req.user?.uloga;
  if (userRole !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

router.get("/", authenticateToken, adminCheck, async (req, res) => {
  try {
    const users = await Korisnik.find().populate("ustanova").populate("uloga");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users." });
  }
});

router.get("/search", authenticateToken, adminCheck, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 3) {
      return res
        .status(400)
        .json({ message: "Search query must be at least 3 characters." });
    }

    const regex = new RegExp(query, "i");

    const users = await Korisnik.find({
      $or: [{ email: regex }, { ime: regex }, { prezime: regex }],
    })
      .populate("ustanova")
      .populate("uloga");

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users." });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const user = await Korisnik.findById(id)
      .populate("ustanova")
      .populate("uloga");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Failed to fetch user." });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { ime, prezime, email, ustanova, uloga } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const user = await Korisnik.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (ime) user.ime = ime;
    if (prezime) user.prezime = prezime;
    if (email) user.email = email;
    if (ustanova) user.ustanova = ustanova;
    if (uloga) user.uloga = uloga;

    await user.save();
    res.status(200).json({ message: "User updated successfully.", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Failed to update user." });
  }
});

router.delete("/:id", authenticateToken, adminCheck, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const user = await Korisnik.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully.", user });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

module.exports = router;
