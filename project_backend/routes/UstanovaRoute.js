const express = require("express");

const Ustanova = require("../models/Ustanova");
const Korisnik = require("../models/Korisnik");
const { authenticateToken } = require("../controllers/authController");

const router = express.Router();

// Middleware to check admin role
const isAdmin = async (req, res, next) => {
    try {
        const user = await Korisnik.findById(req.user.korisnik_id).populate("uloga");
        if (!user || !user.uloga.some(role => role.naziv === "admin")) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        next();
    } catch (err) {
        console.error("Error validating admin role:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Fetch all institutions
router.get("/", authenticateToken, async (req, res) => {
    try {
        const ustanovas = await Ustanova.find().populate("drzava", "naziv");
        res.status(200).json({ success: true, data: ustanovas });
    } catch (err) {
        console.error("Error fetching institutions:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Fetch institutions not in the user's country
router.get("/not-from", authenticateToken, async (req, res) => {
    try {
        const user = await Korisnik.findById(req.user.korisnik_id).populate("ustanova");
        if (!user || !user.ustanova) {
            return res.status(400).json({ message: "User's institution not found." });
        }

        const userDrzavaId = user.ustanova.drzava;

        const ustanovas = await Ustanova.find({ drzava: { $ne: userDrzavaId } }).populate(
            "drzava",
            "naziv"
        );

        res.status(200).json({ success: true, data: ustanovas });
    } catch (err) {
        console.error("Error fetching institutions:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Create a new institution
router.post("/", authenticateToken, isAdmin, async (req, res) => {
    try {
        const { ime, adresa, kontakt, drzava, quotaStudents, quotaProfessors } = req.body;

        const newUstanova = new Ustanova({
            ime,
            adresa,
            kontakt,
            drzava,
            quotaStudents,
            quotaProfessors,
            applicationsAcceptedStudents: 0,
            applicationsAcceptedProfessors: 0,
        });

        const savedUstanova = await newUstanova.save();
        res.status(201).json({ success: true, data: savedUstanova });
    } catch (err) {
        console.error("Error creating institution:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Update an existing institution by ID
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const { ime, adresa, kontakt, drzava, quotaStudents, quotaProfessors } = req.body;

        const updatedUstanova = await Ustanova.findByIdAndUpdate(
            req.params.id,
            {
                ime,
                adresa,
                kontakt,
                drzava,
                quotaStudents,
                quotaProfessors,
            },
            { new: true } // Ensures the updated document is returned
        );

        if (!updatedUstanova) {
            return res.status(404).json({ message: "Institution not found." });
        }

        res.status(200).json({ success: true, data: updatedUstanova });
    } catch (err) {
        console.error("Error updating institution:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Delete an institution by ID
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const deletedUstanova = await Ustanova.findByIdAndDelete(req.params.id);

        if (!deletedUstanova) {
            return res.status(404).json({ message: "Institution not found." });
        }

        res.status(200).json({ success: true, message: "Institution deleted successfully." });
    } catch (err) {
        console.error("Error deleting institution:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Fetch institution by ID
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const institution = await Ustanova.findById(req.params.id).populate("drzava", "naziv");
        if (!institution) {
            return res.status(404).json({ message: "Institution not found." });
        }
        res.status(200).json(institution);
    } catch (err) {
        console.error("Error fetching institution details:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});



module.exports = router;
