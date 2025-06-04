const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    nip: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                // Basic NIP validation (10 digits)
                return /^\d{10}$/.test(v);
            },
            message: 'NIP must be exactly 10 digits'
        }
    },
    regon: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                // REGON can be 9 or 14 digits
                return /^\d{9}$|^\d{14}$/.test(v);
            },
            message: 'REGON must be 9 or 14 digits'
        }
    },
    address: {
        street: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
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
        required: true,
        unique: true // One company per user
    },
    isVerified: {
        type: Boolean,
        default: false
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

// Update the updatedAt field before saving
CompanySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Company', CompanySchema);