const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    location: {
        street: String,
        city: String,
        region: String,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    description: { type: String, default: '' },
    pricing: {
        minPricePerPerson: { type: Number, default: null },
        maxPricePerPerson: { type: Number, default: null },
        isPriceHidden: { type: Boolean, default: false },
    },
    availability: [{
        date: { type: Date, required: true },
        status: {
            type: String,
            enum: ['free', 'booked', 'partially', 'preBooked', 'unavailable', 'promo'],
            default: 'free'
        }
    }],
    images: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venue', VenueSchema);