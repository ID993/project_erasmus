// routes/Countries.js
const express = require('express');
const router = express.Router();
const Drzava = require('../models/Drzava');  // Import the Drzava model

// Route to get all countries (drzave)
router.get('/', async (req, res) => {
    //console.log('Fetching countries...');
    try {
        const drzave = await Drzava.find();
        //console.log('Fetched countries:', drzave);  // Log fetched countries
        res.json(drzave);
    } catch (err) {
        console.error('Error fetching countries:', err);
        res.status(500).json({ message: 'Failed to fetch countries' });
    }
});

module.exports = router;
