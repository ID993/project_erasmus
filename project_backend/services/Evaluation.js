const Prijava = require("../models/Prijava");
const Ustanova = require("../models/Ustanova");
const mongoose = require("mongoose");
const { sendEmail } = require("../services/Mailer");
const applicationProcessed = require("../templates/applicationProcessed");

const MINIMAL_GPA = 3.5;
const MINIMAL_POINTS = 15;

class Evaluation {
  static async evaluateApplications(institutionId) {
    try {
      if (!institutionId || !mongoose.Types.ObjectId.isValid(institutionId)) {
        throw new Error(`Invalid institution ID: ${institutionId}`);
      }

      const institution = await Ustanova.findById(institutionId).populate(
        "prijave"
      );

      if (!institution) {
        throw new Error(`Institution not found for ID: ${institutionId}`);
      }

      const applications = await Prijava.find({
        ustanova: institutionId,
        status: "sent",
      }).populate({
        path: "user",
        select: "ime prezime email",
        populate: {
          path: "uloga",
          select: "naziv",
        },
      });

      if (!applications.length) {
        return {
          message: "No applications found for this institution.",
          acceptedCount: 0,
          notAcceptedCount: 0,
        };
      }

      let acceptedStudents = institution.applicationsAcceptedStudents;
      let acceptedProfessors = institution.applicationsAcceptedProfessors;

      for (const application of applications) {
        const roles = application.user.uloga.map((role) => role.naziv);

        if (roles.includes("student") && application.gpa >= MINIMAL_GPA) {
          if (acceptedStudents < institution.quotaStudents) {
            application.status = "accepted";
            //acceptedStudents++;
          } else {
            application.status = "not accepted (quota reached)";
          }
        } else if (
          roles.includes("profesor") &&
          application.points >= MINIMAL_POINTS
        ) {
          if (acceptedProfessors < institution.quotaProfessors) {
            application.status = "accepted";
            //acceptedProfessors++;
          } else {
            application.status = "not accepted (quota reached)";
          }
        } else {
          application.status = "not accepted";
        }

        await application.save();
        institution.applicationsAcceptedStudents = acceptedStudents;
        institution.applicationsAcceptedProfessors = acceptedProfessors;
        await institution.save();

        const emailContent = applicationProcessed(
          application.user.ime,
          application.user.prezime,
          institution.ime,
          application.status
        );
        await sendEmail(
          application.user.email,
          "Erasmus Application Status Update",
          emailContent
        );
      }

      return {
        message: "Applications evaluated successfully.",
        acceptedStudents,
        acceptedProfessors,
      };
    } catch (error) {
      console.error(`Error evaluating applications: ${error.message}`);
      throw error;
    }
  }
}

module.exports = Evaluation;
