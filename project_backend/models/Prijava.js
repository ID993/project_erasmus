const mongoose = require("mongoose");

const prijavaSchema = new mongoose.Schema(
  {
    gpa: {
      type: Number,

      validate: {
        validator: async function (value) {
          const korisnik = await mongoose
            .model("Korisnik")
            .findById(this.user)
            .populate("uloga");

          const requiresSpecialAttribute = korisnik.uloga.some(
            (uloga) => uloga.naziv === "student"
          );
          if (requiresSpecialAttribute && !value) {
            return false;
          }
          return true;
        },
        message: "Special attribute is required for users with 'student' role.",
      },
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
    ustanova: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ustanova",
      required: true,
    }, // Reference to Ustanova (Institution)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Korisnik", // Korisnik
      required: true,
    }, // Reference to the User who is submitting the application
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prijava", prijavaSchema);
