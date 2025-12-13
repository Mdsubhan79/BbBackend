const mongoose = require("mongoose");

const tiffinSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["veg", "nonveg"],
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    meals: {
      type: [String], // ["Roti", "Dal", "Sabzi"]
      required: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tiffin", tiffinSchema);
