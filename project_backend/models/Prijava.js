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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Prijava", prijavaSchema);
