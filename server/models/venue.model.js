const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Wedding & Banquet Halls',
            'Conference & Meeting Rooms',
            'Outdoor & Garden Spaces',
            'Clubs & Bars',
            'Lofts & Industrial Venues',
            'Unique & Themed Spaces'
        ]
    },
    location: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        region: {
            type: String,
            required: true,
            enum: [
                'Malopolska',
                'Mazowieckie',
                'Dolnoslaskie',
                'Pomorskie',
                'Wielkopolskie',
                'Slaskie',
                'Lubelskie',
                'Podlaskie',
                'Zachodniopomorskie',
                'Lubuskie',
                'Kujawsko-Pomorskie',
                'Lodzkie',
                'Swietokrzyskie',
                'Podkarpackie',
                'Warminsko-Mazurskie'
            ]
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: false // Optional - for cases where company might not be required
    },
    description: {
        type: String,
        default: ''
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    pricing: {
        minPricePerPerson: {
            type: Number,
            default: null,
            min: 0
        },
        maxPricePerPerson: {
            type: Number,
            default: null,
            min: 0
        },
        isPriceHidden: {
            type: Boolean,
            default: false
        }
    },
    images: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Validate pricing logic
VenueSchema.pre('save', function(next) {
    this.updatedAt = Date.now();

    // If maxPricePerPerson is set, it should be >= minPricePerPerson
    if (this.pricing.maxPricePerPerson && this.pricing.minPricePerPerson) {
        if (this.pricing.maxPricePerPerson < this.pricing.minPricePerPerson) {
            next(new Error('Maximum price cannot be less than minimum price'));
        }
    }

    next();
});

// Indexes for better query performance
VenueSchema.index({ owner: 1 });
VenueSchema.index({ company: 1 });
VenueSchema.index({ category: 1 });
VenueSchema.index({ 'location.region': 1 });
VenueSchema.index({ 'location.city': 1 });
VenueSchema.index({ rating: -1 });
VenueSchema.index({ reviews: -1 });
VenueSchema.index({ isActive: 1 });

module.exports = mongoose.model('Venue', VenueSchema);