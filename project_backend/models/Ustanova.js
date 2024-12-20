const mongoose = require("mongoose");

const ustanovaSchema = new mongoose.Schema(
  {
    ime: {
      type: String,
      required: true,
    },
    adresa: {
      type: String,
      required: true,
    },
    drzava: {
      type: String,
      required: true,
    },
    kontakt: {
      type: String,
      required: false,
    },

    smjerovi: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Smjer",
      },
    ],
    prijave: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prijava",
      },
    ],
  },
  { timestamps: true }
);

const Ustanova = mongoose.model("Ustanova", ustanovaSchema);

module.exports = Ustanova;
