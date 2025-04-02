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

    ratingService: { 
        type: Number, 
        min: 1, 
        max: 5, 
        required: true 
    },

    ratingAgreement: { 
        type: Number, 
        min: 1, 
        max: 5, 
        required: true 
    },     

    ratingCommunication: { 
        type: Number, 
        min: 1, 
        max: 5, 
        required: true 
    },

    ratingMenu: { 
        type: Number, 
        min: 1, 
        max: 5, 
        required: true 
    },

    ratingCleanliness: { 
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

module.exports = mongoose.model('Review', ReviewSchema);