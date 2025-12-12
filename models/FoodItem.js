const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: String,
  desc: String,
  price: Number,
  category: { type: String, enum: ["veg", "non-veg"] },
  image: String
});

module.exports = mongoose.model("FoodItem", foodItemSchema);
