const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['refresh', 'email_verification', 'password_reset'],
        default: 'refresh'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    deviceInfo: {
        userAgent: String,
        ip: String,
        device: String
    },
    lastUsed: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 30 * 24 * 60 * 60 // 30 days in seconds
    }
});

module.exports = mongoose.model('Token', TokenSchema);