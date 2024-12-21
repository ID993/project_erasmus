const mongoose = require("mongoose");

const drzavaSchema = new mongoose.Schema({
  naziv: { type: String, required: true, unique: true },
});

const Drzava = mongoose.model("Drzava", drzavaSchema);

module.exports = Drzava;
