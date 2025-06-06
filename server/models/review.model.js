// Updated server/models/review.model.js
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue',
        required: true
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    comment: {
        type: String,
        default: ''
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure one review per user per venue
ReviewSchema.index({ user: 1, venue: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);