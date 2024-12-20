const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // For password hashing

const korisnikSchema = new mongoose.Schema({
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sifra: { type: String, required: true },
  uloga: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Uloga",
    },
  ],
});

const Korisnik = mongoose.model("Korisnik", korisnikSchema);

module.exports = Korisnik;
