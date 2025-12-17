const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  plan: { type: String, required: true },

  status: {
    type: String,
    enum: ["pending", "active"],
    default: "pending"
  },

  customerDetails: {
    fullName: String,
    fatherName: String,
    profession: String,
    address: String,
    phone: String,
    email: String,
    city: String,
    state: String
  },

  userEmail: { type: String }, // IMPORTANT for admin

  bookingDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
