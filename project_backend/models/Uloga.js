const mongoose = require("mongoose");

const ulogaSchema = new mongoose.Schema(
  {
    naziv: { type: String, required: true },
  },
  { timestamps: true }
);

const Uloga = mongoose.model("Uloga", ulogaSchema);

module.exports = Uloga;
