const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  items: [String],
  time: String
});

const daySchema = new mongoose.Schema({
  dayNumber: Number,
  breakfast: mealSchema,
  lunch: mealSchema,
  dinner: mealSchema
});

const tiffinMenuSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TiffinBooking",
    required: true
  },
  days: [daySchema]
}, { timestamps: true });

module.exports = mongoose.model("TiffinMenu", tiffinMenuSchema);