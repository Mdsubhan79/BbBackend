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

    mealTime: {   // ✅ NEW FIELD
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true
    },

    description: {   // ✅ NEW FIELD
      type: String,
      required: true
    },

    price: {
      type: Number,
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