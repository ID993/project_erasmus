// /backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Korisnik = require('../models/Korisnik'); // Ensure you're importing the model correctly
const dotenv = require('dotenv').config();
// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'SuperDuperSecretKey12345';

// Register a new user
const registerUser = async (req, res) => {
    const { ime, prezime, email, sifra } = req.body;

    try {
        // Check if email exists
        const existingUser = await Korisnik.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(sifra, 10);

        // Create the new user
        const newUser = new Korisnik({
            ime,
            prezime,
            email,
            sifra: hashedPassword,  // Make sure the field matches the schema
        });

        await newUser.save(); // Save to MongoDB

        res.status(201).json({ message: 'User created successfully', korisnik_id: newUser._id });

    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Login a user
const loginUser = async (req, res) => {
    const { email, sifra } = req.body;

    console.log('Login Request Body:', req.body); // Log the request body

    if (!email || !sifra) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await Korisnik.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(sifra, user.sifra);

        if (!isMatch) {
            console.log('Passwords do not match.', sifra, user.sifra);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { korisnik_id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = { registerUser, loginUser };
