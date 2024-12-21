const mongoose = require("mongoose");

const korisnikSchema = new mongoose.Schema({
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sifra: { type: String, required: true },
  ustanova: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ustanova",
    //required: true,
  },
  uloga: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Uloga",
      //required: true,
    },
  ],
});

const Korisnik = mongoose.model("Korisnik", korisnikSchema);

module.exports = Korisnik;
