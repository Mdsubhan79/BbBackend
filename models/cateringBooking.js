const mongoose = require("mongoose");

const cateringBookingSchema = new mongoose.Schema({

    customerName: String,
    phone: String,

    servingStaff: {
        qty: Number,
        price: Number
    },

    cleaningStaff: {
        qty: Number,
        price: Number
    },

    cookingStaff: {
        qty: Number,
        price: Number
    },

    tent: {
        size: String,
        items: [String],
        price: Number
    },

    date: String, 

    urgentBooking: { 
        type: Boolean, 
        default: false
    },

    totalPrice: Number,

    bookingStatus: {
        type: String,
        default: "Pending"
    }

}, { timestamps: true });

module.exports = mongoose.model(
    "CateringBooking",
    cateringBookingSchema
);