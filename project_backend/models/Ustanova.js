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
        kontakt: {
            type: String,
            required: false,
        },
        drzava: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Drzava",
            required: true,
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
        quotaStudents: {
            type: Number,
            required: true,
            default: 0,
        },
        quotaProfessors: {
            type: Number,
            required: true,
            default: 0,
        },
        applicationsAcceptedStudents: {
            type: Number,
            default: 0,
        },
        applicationsAcceptedProfessors: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Ustanova = mongoose.model("Ustanova", ustanovaSchema);

module.exports = Ustanova;
