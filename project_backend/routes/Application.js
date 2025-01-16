const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Prijava = require("../models/Prijava");
const Ustanova = require("../models/Ustanova");
const Drzava = require("../models/Drzava");
const Korisnik = require("../models/Korisnik");
const Evaluation = require("../services/Evaluation");
const { authenticateToken } = require("../controllers/authController");
const { sendEmail } = require("../services/Mailer");
const applicationSubmitted = require("../templates/applicationSubmitted");
const applicationConfirmed = require("../templates/applicationConfirmed");

// POST route for applications
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      gpa, // Only relevant for students
      firstMobility,
      motivationLetter,
      englishProficiency,
      destinationLanguage,
      initiatedLLP,
      institution,
      program,
    } = req.body;

    const userId = req.user.korisnik_id; // User ID from the authenticated user
    const user = await Korisnik.findById(userId).populate("uloga"); // Populate roles

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otherApplications = await Prijava.find({ user: userId }).populate(
      "ustanova program"
    );

    const hasConfirmedApplication = otherApplications.some(
      (application) => application.status === "confirmed"
    );

    if (hasConfirmedApplication) {
      return res.status(400).json({
        message:
          "You cannot submit any more applications as one is already confirmed.",
      });
    }

    const existingApplication = await Prijava.findOne({
      user: userId,
      ustanova: institution,
      program: program,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied to this institution and program.",
      });
    }

    // Determine the user's role by checking the 'naziv' field in 'uloga'
    const isStudent = user.uloga.some((role) => role.naziv === "student");
    const isProfessor = user.uloga.some((role) => role.naziv === "profesor");

    console.log(
      "User role:",
      isStudent ? "student" : isProfessor ? "professor" : "unknown"
    );

    // Validate required fields
    if (
      firstMobility === null ||
      motivationLetter === null ||
      englishProficiency === null ||
      destinationLanguage === null ||
      initiatedLLP === null ||
      !institution
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Initialize score
    let score = 0;

    // Add weights for checkboxes
    const weights = {
      firstMobility: 15,
      motivationLetter: 2,
      englishProficiency: 2,
      destinationLanguage: 1,
      initiatedLLP: 1,
    };

    if (firstMobility) score += weights.firstMobility;
    if (motivationLetter) score += weights.motivationLetter;
    if (englishProficiency) score += weights.englishProficiency;
    if (destinationLanguage) score += weights.destinationLanguage;
    if (initiatedLLP) score += weights.initiatedLLP;

    console.log("Score after checkboxes:", score);

    // Add GPA contribution for students; default GPA for professors
    const finalGPA = isStudent ? parseFloat(gpa) : 1; // Default GPA to 1 for professors
    if (isStudent && (isNaN(finalGPA) || finalGPA < 3.0 || finalGPA > 5.0)) {
      return res.status(400).json({ message: "Invalid GPA provided." });
    }
    score += finalGPA * 8;

    console.log("Final GPA:", finalGPA, "Total score:", score);

    // Create and save the application
    const application = new Prijava({
      gpa: isStudent ? gpa : 1, // Save GPA for students; default to 1 for professors
      firstMobility,
      motivationLetter,
      englishProficiency,
      destinationLanguage,
      initiatedLLP,
      ustanova: institution,
      user: userId,
      program: program,
      points: score, // Save calculated score
    });

    await application.save();

    const institutionModel = await Ustanova.findById(institution);

    const emailContent = applicationSubmitted(
      user.ime,
      user.prezime,
      institutionModel.ime
    );
    await sendEmail(
      user.email,
      "Erasmus Application Submitted Successfully",
      emailContent
    );

    res.status(201).json({
      message:
        "Application submitted successfully and confirmation email sent!",
      finalScore: score,
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    res
      .status(500)
      .json({ message: "An error occurred while processing the application." });
  }
});

router.get("/confirm-application/:id", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const { id } = req.params;
    const user = await Korisnik.findOne({ email }).populate("uloga");
    if (!user) {
      console.error("User not found for email:", email);
      return res.status(400).json({ message: "User not found." });
    }
    const applicationToConfirm = await Prijava.findById(id).populate(
      "ustanova user"
    );
    if (!applicationToConfirm) {
      console.error("Application not found for ID:", id);
      return res.status(404).json({ message: "Application not found." });
    }

    const isStudent = user.uloga.some((role) => role.naziv === "student");
    const isProfessor = user.uloga.some((role) => role.naziv === "profesor");

    if (!isStudent && !isProfessor) {
      return res.status(400).json({ message: "User role is not valid." });
    }

    applicationToConfirm.status = "confirmed";
    await applicationToConfirm.save();

    const institution = applicationToConfirm.ustanova;
    const institutionToUpdate = await Ustanova.findById(institution._id);
    if (isStudent) {
      institutionToUpdate.applicationsAcceptedStudents += 1;
    } else if (isProfessor) {
      institutionToUpdate.applicationsAcceptedProfessors += 1;
    }
    await institutionToUpdate.save();

    const otherApplications = await Prijava.find({
      user: applicationToConfirm.user._id,
      _id: { $ne: id },
    }).populate("ustanova");

    // for (const application of otherApplications) {
    //   application.status = "declined";
    //   await application.save();
    // }

    for (const application of otherApplications) {
      if (application.status === "accepted" || application.status === "sent") {
        application.status = "declined";
      }
      // if (isStudent && application.ustanova._id.equals(institution._id)) {
      //   institution.applicationsAcceptedStudents = Math.max(
      //     0,
      //     institution.applicationsAcceptedStudents - 1
      //   );
      // } else if (
      //   isProfessor &&
      //   application.ustanova._id.equals(institution._id)
      // ) {
      //   institution.applicationsAcceptedProfessors = Math.max(
      //     0,
      //     institution.applicationsAcceptedProfessors - 1
      //   );
      // }
      await application.save();
    }

    await institution.save();

    const emailContent = applicationConfirmed(
      applicationToConfirm.user.ime,
      applicationToConfirm.user.prezime,
      applicationToConfirm.ustanova.ime,
      applicationToConfirm.status
    );
    await sendEmail(
      user.email,
      "Erasmus Application Confirmed Successfully",
      emailContent
    );
    res.status(200).json({
      message:
        "Application confirmed, and other applications declined successfully.",
      confirmedApplication: applicationToConfirm,
      declinedApplications: otherApplications.map((app) => ({
        _id: app._id,
        status: app.status,
        institution: app.ustanova,
      })),
    });
  } catch (err) {
    console.error("Error updating applications:", err);
    res.status(500).json({ message: "Failed to update applications." });
  }
});

// Endpoint to get countries excluding user's own country
router.get("/not-from", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;

    const user = await Korisnik.findOne({ email }).populate("ustanova");
    if (!user || !user.ustanova) {
      console.error("User ustanova not found for email:", email);
      return res.status(400).json({ message: "User's ustanova not found." });
    }

    const drzavas = await Drzava.find({ _id: { $ne: user.ustanova.drzava } });
    res.json(drzavas);
  } catch (err) {
    console.error("Error fetching countries:", err);
    res.status(500).json({ message: "Failed to fetch countries" });
  }
});

// Endpoint for getting institutions from countries
router.get("/institutions/:country", async (req, res) => {
  try {
    const { country } = req.params; // country name is passed in the URL
    const drzava = await Drzava.findOne({ naziv: country }); // Find country by name

    if (!drzava) {
      return res.status(404).json({ message: `Country ${country} not found` });
    }

    const institutions = await Ustanova.find({ drzava: drzava._id }).populate(
      "drzava",
      "naziv"
    );
    res.status(200).json(institutions);
  } catch (error) {
    console.error("Error fetching institutions:", error);
    res.status(500).json({ message: "Error fetching institutions." });
  }
});

// Endpoint for getting all applications for admin
router.get("/get-all", authenticateToken, async (req, res) => {
  try {
    const { uloga, korisnik_id } = req.user;
    let data = [];

    if (uloga === "admin") {
      const prijave = await Prijava.find()
        .populate("user", "ime prezime email uloga")
        .populate({
          path: "user",
          populate: {
            path: "uloga",
            select: "naziv",
          },
        })
        .populate({
          path: "ustanova",
          select:
            "ime applicationsAcceptedStudents applicationsAcceptedProfessors quotaStudents quotaProfessors",
        })
        .populate("program");
      data = prijave;
    } else if (uloga === "student" || uloga === "profesor") {
      const prijave = await Prijava.find({ user: korisnik_id })
        .populate("user", "ime prezime email uloga")
        .populate({
          path: "user",
          populate: {
            path: "uloga",
            select: "naziv",
          },
        })
        .populate({
          path: "ustanova",
          select:
            "ime applicationsAcceptedStudents applicationsAcceptedProfessors quotaStudents quotaProfessors",
        })
        .populate("program");
      data = prijave;
    } else {
      return res.status(403).json({ message: "Access denied." });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error fetching applications by role:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Endpoint for evaluating applications
router.post("/evaluate", authenticateToken, async (req, res) => {
  if (req.user.uloga !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admin can evaluate applications." });
  }

  const { institutionIds, role } = req.body;

  try {
    if (
      !Array.isArray(institutionIds) ||
      institutionIds.some((id) => !mongoose.Types.ObjectId.isValid(id))
    ) {
      return res
        .status(400)
        .json({ message: "Invalid institution ID format." });
    }

    let totalAccepted = 0;
    let totalRejected = 0;

    for (const institutionId of institutionIds) {
      const result = await Evaluation.evaluateApplications(institutionId, role);
      totalAccepted += result.acceptedCount;
      totalRejected += result.notAcceptedCount;
    }

    res.status(200).json({
      message: `Evaluation completed. Accepted: ${totalAccepted}, Rejected: ${totalRejected}.`,
    });
  } catch (error) {
    console.error("Evaluation Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
