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

const defaultMenuSchema = new mongoose.Schema({
  days: [daySchema]
});

module.exports = mongoose.model("DefaultTiffinMenu", defaultMenuSchema);