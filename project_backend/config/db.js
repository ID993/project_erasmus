// /backend/config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

connectDB(); // Invoke the connection function
