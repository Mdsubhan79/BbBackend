const mongoose = require("mongoose");

const tiffinBookingSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tiffin",
      required: true
    },
    planName: {
      type: String,
      required: true
    },
    planType: {
      type: String,
      enum: ["veg", "nonveg"],
      required: true
    },
    price: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TiffinBooking", tiffinBookingSchema);
tiffinBookingSchema.pre("save", async function (next) {
  const active = await this.constructor.findOne({
    phone: this.phone,
    status: "active"
  });

  if (active) {
    throw new Error("Active subscription already exists");
  }
  next();
});
