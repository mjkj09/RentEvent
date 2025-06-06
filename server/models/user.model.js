const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    surname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        default: ''
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['admin', 'owner', 'renter'],
        default: 'renter'
    },

    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue'
    }]
});

module.exports = mongoose.model('User', UserSchema);
