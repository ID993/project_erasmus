const mongoose = require("mongoose");

const applicationPeriodSchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

module.exports = mongoose.model("ApplicationPeriod", applicationPeriodSchema);
