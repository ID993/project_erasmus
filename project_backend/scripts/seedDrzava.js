const mongoose = require("mongoose");
require("dotenv").config();

const Drzava = require("../models/Drzava");

const drzave = [
  { naziv: "Hrvatska" },
  { naziv: "Austrija" },
  { naziv: "Španjolska" },
  { naziv: "Italija" },
  { naziv: "Njemačka" },
  { naziv: "Francuska" },
  { naziv: "Finska" },
  { naziv: "Portugal" },
  { naziv: "Ujedinjeno Kraljevstvo" },
  { naziv: "Švicarska" },
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

const populateDrzava = async () => {
  try {
    await Drzava.deleteMany();
    console.log("Existing Drzava entries cleared!");

    await Drzava.insertMany(drzave);
    console.log("Drzava collection populated successfully!");

    process.exit();
  } catch (err) {
    console.error("Error populating Drzava:", err.message);
    process.exit(1);
  }
};

const runScript = async () => {
  await connectDB();
  await populateDrzava();
};

runScript();
