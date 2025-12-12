const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: String,
  plan: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
