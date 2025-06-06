
const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    // Request metadata
    venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Contact information from form
    senderName: {
        type: String,
        required: true,
        trim: true
    },
    senderEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    senderPhone: {
        type: String,
        required: true,
        trim: true
    },

    // Event details
    eventDate: {
        type: Date,
        required: false
    },
    eventType: {
        type: String,
        required: true,
        enum: [
            'Wedding',
            'Corporate Event',
            'Birthday Party',
            'Anniversary',
            'Conference',
            'Workshop',
            'Product Launch',
            'Networking Event',
            'Social Gathering',
            'Other'
        ]
    },
    expectedGuestCount: {
        type: Number,
        required: true,
        min: 1
    },
    message: {
        type: String,
        required: true,
        trim: true
    },

    // Request status
    status: {
        type: String,
        enum: ['pending', 'responded', 'cancelled'],
        default: 'pending'
    },

    // Email sending status
    emailSent: {
        type: Boolean,
        default: false
    },
    emailSentAt: {
        type: Date
    },
    emailError: {
        type: String
    },

    // Read status for notifications
    isReadByReceiver: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    },

    // Deletion tracking (soft delete)
    deletedBySender: {
        type: Boolean,
        default: false
    },
    deletedByReceiver: {
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

// Pre-save middleware
RequestSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Pre-save middleware to validate guest count against venue capacity
RequestSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('expectedGuestCount')) {
        try {
            const venue = await mongoose.model('Venue').findById(this.venue);
            if (venue && this.expectedGuestCount > venue.capacity) {
                const error = new Error(`Guest count (${this.expectedGuestCount}) exceeds venue capacity (${venue.capacity})`);
                error.statusCode = 400;
                return next(error);
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Indexes for better performance
RequestSchema.index({ sender: 1, createdAt: -1 });
RequestSchema.index({ receiver: 1, createdAt: -1 });
RequestSchema.index({ venue: 1 });
RequestSchema.index({ status: 1 });
RequestSchema.index({ isReadByReceiver: 1 });

module.exports = mongoose.model('Request', RequestSchema);