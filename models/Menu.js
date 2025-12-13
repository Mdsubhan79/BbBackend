const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: String,
  name_hi: String,
  price: Number,
  type: { type: String, enum: ["veg", "nonveg"] },
  category: String,
  available: Boolean
});

module.exports = mongoose.model("Menu", menuSchema);
