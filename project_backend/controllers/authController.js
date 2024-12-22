const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Korisnik = require("../models/Korisnik");
const Ustanova = require("../models/Ustanova");
const Uloga = require("../models/Uloga");
const dotenv = require("dotenv").config();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "SuperDuperSecretKey12345";

const blacklist = []; // Use Redis or DB in production
const isTokenBlacklisted = (token) => blacklist.includes(token);

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function comparePasswords(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

// Register a new user
const registerUser = async (req, res) => {
  const { ime, prezime, email, sifra, ustanova, uloga } = req.body;

  if (!email || !sifra || !ustanova || !uloga) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingUser = await Korisnik.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const institution = await Ustanova.findById(ustanova).populate(
      "drzava",
      "naziv"
    );
    if (!institution) {
      return res.status(400).json({ message: "Invalid institution" });
    }

    const password = await hashPassword(sifra);

    const newUser = new Korisnik({
      ime,
      prezime,
      email,
      sifra: password,
      ustanova,
      uloga,
      country: institution.drzava.naziv,
    });

    await newUser.save(); // Save to MongoDB

    res
      .status(201)
      .json({ message: "User created successfully", korisnik_id: newUser._id });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, sifra } = req.body;

  if (!email || !sifra) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await Korisnik.findOne({ email });
    const role = await Uloga.findById(user.uloga);
    console.log(role.naziv);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePasswords(sifra, user.sifra);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { korisnik_id: user._id, email: user.email, uloga: role.naziv },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all institutions
const getInstitutions = async (req, res) => {
  try {
    const institutions = await Ustanova.find();
    res.status(200).json(institutions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all roles
const getRoles = async (req, res) => {
  try {
    const roles = await Uloga.find();
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Authenticate token
const authenticateToken = (req, res, next) => {
  // Check if the token is present in the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach the decoded user data to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// Logout
const logoutUser = (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  blacklist.push(token); // In production, store in Redis or DB
  res.status(200).json({ message: "Logout successful" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getInstitutions,
  getRoles,
  authenticateToken,
};
