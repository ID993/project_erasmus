// /backend/models/Korisnik.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  // For password hashing

// Define the Korisnik schema
const korisnikSchema = new mongoose.Schema({
    ime: { type: String, required: true },
    prezime: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    sifra: { type: String, required: true },  // Change "sifta" to "sifra"
});


// Hash the password before saving the user
korisnikSchema.pre('save', async function (next) {
    if (this.isModified('sifra')) {  // Hash only if the password is modified
        this.sifra = await bcrypt.hash(this.sifra, 10);  // 10 is the saltRounds
    }
    next();
});

// Create the model based on the schema
const Korisnik = mongoose.model('Korisnik', korisnikSchema);

module.exports = Korisnik;
