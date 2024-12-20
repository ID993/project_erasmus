const mongoose = require("mongoose");
require("dotenv").config();

const Program = require("../models/Program");

const programi = [
  { naziv: "Praksa", opis: "Student obavlja praksu na erasmus programu" },
  {
    naziv: "Diplomski/Završni rad",
    opis: "Student piše diplomski rad na erasmus programu",
  },
  {
    naziv: "Pohađanje nastave",
    opis: "Student pohađa nastavu na erasmus programu",
  },
  { naziv: "Usavršavanje", opis: "Profesor se usavršava na erasmus programu" },
  {
    naziv: "Održavanje predavanja",
    opis: "Profesor održava predavanja na erasmus programu",
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
};

const populateProgram = async () => {
  try {
    await Program.deleteMany();
    console.log("Existing Program entries cleared!");

    await Program.insertMany(programi);
    console.log("Program collection populated successfully!");

    process.exit();
  } catch (err) {
    console.error("Error populating Program:", err.message);
    process.exit(1);
  }
};

const runScript = async () => {
  await connectDB();
  await populateProgram();
};

runScript();
