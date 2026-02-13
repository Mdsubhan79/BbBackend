const tiffinSchema = new mongoose.Schema(
  {
    planName: { type: String, required: true },

    type: { 
      type: String, 
      enum: ["veg", "nonveg"], 
      required: true 
    },

    mealType: { 
      type: String, 
      enum: ["breakfast", "lunch", "dinner"], 
      required: true 
    },

    description: {
      type: String,
      required: true
    },

    price: { type: Number, required: true },

    meals: { type: [String], required: true },

    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);