const mongoose = require("mongoose");

const prijavaSchema = new mongoose.Schema(
  {
    gpa: {
      type: Number,
      validate: {
        validator: function (value) {
          if (
            this.userRole === "student" &&
            (!value || value < 3.0 || value > 5.0)
          ) {
            return false;
          }
          return true;
        },
        message:
          "GPA is required for users with 'student' role and must be between 3.0 and 5.0.",
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
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Korisnik",
      required: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        "sent",
        "in progress",
        "done",
        "accepted",
        "not accepted",
        "not accepted (quota reached)",
        "confirmed",
        "declined",
      ],
      default: "sent",
    },
  },
  { timestamps: true }
);

// Indexing for better performance
prijavaSchema.index({ ustanova: 1 });
prijavaSchema.index({ user: 1 });

// Virtual field to check eligibility
prijavaSchema.virtual("isEligible").get(function () {
  return this.status === "accepted" && this.points > 0;
});

// Pre-save hook for points calculation
prijavaSchema.pre("save", async function (next) {
  if (this.isModified("points") || this.isNew) {
    if (!this.points && this.userRole === "profesor") {
      this.points = 0; // Default points if not set
    }
  }
  next();
});

module.exports = mongoose.model("Prijava", prijavaSchema);
