const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, default: 'guest' },
    items: [{
        name: String,
        price: Number,
        quantity: Number,
        category: String,
        customizations: String
    }],
    customerDetails: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        landmark: String
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    totalAmount: Number,
    orderTime: { type: Date, default: Date.now },
    deliveryTime: Date,
    cancellationDeadline: Date,
    adminNotes: String,
    deliveryEstimate: { type: String, default: '25-30 minutes' },
    progressSteps: {
        orderPlaced: { status: Boolean, time: Date },
        confirmed: { status: Boolean, time: Date },
        preparing: { status: Boolean, time: Date },
        outForDelivery: { status: Boolean, time: Date },
        delivered: { status: Boolean, time: Date }
    }
});

module.exports = mongoose.model('Order', orderSchema);