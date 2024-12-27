const Prijava = require("../models/Prijava");
const Ustanova = require("../models/Ustanova");

// Global variables for minimal requirements
const MINIMAL_GPA = 3.5; // Minimal GPA for students
const MINIMAL_POINTS = 17; // Minimal points for professors

class Evaluation {
    /**
     * Evaluates and processes applications for a specific institution.
     * 
     * @param {string} institutionId - The ID of the institution to evaluate.
     * @returns {Promise<object>} - Evaluation summary with accepted and not accepted applications.
     */
    static async evaluateApplications(institutionId) {
        try {
            // Fetch the institution and its associated applications
            const institution = await Ustanova.findById(institutionId).populate("prijave");

            if (!institution) {
                throw new Error("Institution not found.");
            }

            // Get all "sent" applications for this institution
            const applications = await Prijava.find({ ustanova: institutionId, status: "sent" })
                .populate({
                    path: "user",
                    populate: {
                        path: "uloga",
                        select: "naziv",
                    },
                }); // Populate user roles

            if (!applications.length) {
                throw new Error("No applications found for this institution.");
            }

            // Evaluate applications and update their status based on requirements
            for (const application of applications) {
                const roles = application.user.uloga.map((role) => role.naziv); // Extract role names

                if (roles.includes("student") && application.gpa >= MINIMAL_GPA) {
                    application.status = "accepted";
                } else if (roles.includes("profesor") && application.points >= MINIMAL_POINTS) {
                    application.status = "accepted";
                } else {
                    application.status = "not accepted";
                }

                await application.save(); // Save the updated status
            }

            // Count the accepted and not accepted applications
            const acceptedCount = applications.filter(app => app.status === "accepted").length;
            const notAcceptedCount = applications.filter(app => app.status === "not accepted").length;

            // Update institution quota with the number of accepted applications
            institution.applicationsAccepted += acceptedCount;
            await institution.save();

            return {
                message: "Applications evaluated successfully.",
                acceptedCount,
                notAcceptedCount,
            };
        } catch (error) {
            console.error("Error evaluating applications:", error.message);
            throw new Error("Failed to evaluate applications.");
        }
    }
}

module.exports = Evaluation;
