const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    naziv: { type: String, required: true },
    opis: { type: String, required: true },
    tip: { type: String, required: true },
    // datum_pocetka: { type: Date, required: true, default: Date.now },
    // datum_kraja: { type: Date, required: false },
  },
  { timestamps: true }
);

const Program = mongoose.model("Program", programSchema);

module.exports = Program;
