const mongoose = require("mongoose");
require("dotenv").config();

const Uloga = require("../models/Uloga");

const uloge = [{ naziv: "admin" }, { naziv: "student" }, { naziv: "profesor" }];

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

const populateUloga = async () => {
  try {
    await Uloga.deleteMany();
    console.log("Existing Uloga entries cleared!");

    await Uloga.insertMany(uloge);
    console.log("Uloga collection populated successfully!");

    process.exit();
  } catch (err) {
    console.error("Error populating Uloga:", err.message);
    process.exit(1);
  }
};

const runScript = async () => {
  await connectDB();
  await populateUloga();
};

runScript();
