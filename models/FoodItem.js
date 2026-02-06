const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_hi: { type: String },
  price: { type: Number, required: true },
  item_type: { type: String, enum: ["veg", "nonveg"], required: true },
  category: String,
  description: String,
  image: String,
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("FoodItem", foodItemSchema);
