const mongoose = require("mongoose");

const prijavaSchema = new mongoose.Schema(
  {
    gpa: {
      type: Number,
      required: true,
      min: 3.0,
      max: 5.0,
    },
    firstMobility: {
      type: Boolean,
      required: true,
    },
    motivationLetter: {
      type: Boolean,
      required: true,
    },
    englishProficiency: {
      type: Boolean,
      required: true,
    },
    destinationLanguage: {
      type: Boolean,
      required: true,
    },
    initiatedLLP: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prijava", prijavaSchema);
