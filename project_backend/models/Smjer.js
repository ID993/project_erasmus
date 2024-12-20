const mongoose = require("mongoose");

const smjerSchema = new mongoose.Schema(
  {
    naziv: { type: String, required: true },
    podrucje: { type: String, required: true },
  },
  { timestamps: true }
);

const Smjer = mongoose.model("Smjer", smjerSchema);

module.exports = Smjer;
