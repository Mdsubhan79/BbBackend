const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: String,
  category: String,  // veg / nonveg / highprotein
  price: Number,
  image: String,
  description: String
});

module.exports = mongoose.model("Food", foodSchema);
