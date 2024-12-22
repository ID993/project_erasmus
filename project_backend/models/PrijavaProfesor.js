const mongoose = require("mongoose");

const prijavaProfesorSchema = new mongoose.Schema(
  {
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
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
  },
  { timestamps: true }
);

const PrijavaProfesor = mongoose.model(
  "PrijavaProfesor",
  prijavaProfesorSchema
);

module.exports = PrijavaProfesor;
