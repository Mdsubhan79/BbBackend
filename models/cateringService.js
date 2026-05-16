const mongoose = require("mongoose");

const cateringServiceSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    tagline: {
        type: String,
        required: true
    },

    icon: {
        type: String,
        default: "🍽️"
    },

    price: {
        type: Number,
        required: true
    },

    unit: {
        type: String,
        default: "staff"
    },

    items: {
        type: [String],
        default: []
    },

    sizes: [
        {
            size: String,
            price: Number,
            items: [String]
        }
    ],

    isPackage: {
        type: Boolean,
        default: false
    },

    packageDetails: {
        serving: Number,
        cleaning: Number,
        cooking: Number,
        tent: String
    },

    image: {
        type: String,
        default: ""
    },

    active: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports = mongoose.model(
    "CateringService",
    cateringServiceSchema
);