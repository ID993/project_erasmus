const express = require("express");
const router = express.Router();
const ApplicationPeriod = require("../models/ApplicationPeriod");
const { authenticateToken } = require("../controllers/authController");

const adminCheck = (req, res, next) => {
  if (req.user?.uloga !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

router.post("/", authenticateToken, adminCheck, async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    let period = await ApplicationPeriod.findOne();
    if (!period) {
      period = new ApplicationPeriod({ startDate, endDate });
    } else {
      period.startDate = startDate;
      period.endDate = endDate;
    }
    await period.save();
    res
      .status(200)
      .json({ message: "Application period updated successfully." });
  } catch (error) {
    console.error("Error updating application period:", error);
    res.status(500).json({ message: "Failed to set application period." });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const period = await ApplicationPeriod.findOne();
    if (!period) {
      return res.status(404).json({ message: "Application period not set." });
    }
    res.status(200).json(period);
  } catch (error) {
    console.error("Error fetching application period:", error);
    res.status(500).json({ message: "Failed to fetch application period." });
  }
});

module.exports = router;
