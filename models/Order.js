const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"       
  },
  items: Array,
  totalPrice: Number,
  orderType: String,
  status: {
    type: String,
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Order", orderSchema);
