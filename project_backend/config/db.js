// /backend/config/db.js
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://ivodamjanovic4:avp@avperasmus.rcf10.mongodb.net/?retryWrites=true&w=majority&appName=avperasmus";

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
