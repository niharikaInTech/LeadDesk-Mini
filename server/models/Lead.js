const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true
    },

    budget: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ["New", "Contacted", "Closed"],
        default: "New"
    }
}, {
    timestamps: true
});

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;