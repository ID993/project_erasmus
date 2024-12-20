const mongoose = require("mongoose");
require("dotenv").config();

const Smjer = require("../models/Smjer");

const smjerovi = [
  { naziv: "Ekonomija", podrucje: "Društvene znanosti" },
  { naziv: "Računarstvo", podrucje: "Tehnologija" },
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

const populateSmjer = async () => {
  try {
    await Smjer.deleteMany();
    console.log("Existing Smjer entries cleared!");

    await Smjer.insertMany(smjerovi);
    console.log("Smjer collection populated successfully!");

    process.exit();
  } catch (err) {
    console.error("Error populating Smjer:", err.message);
    process.exit(1);
  }
};

const runScript = async () => {
  await connectDB();
  await populateSmjer();
};

runScript();
