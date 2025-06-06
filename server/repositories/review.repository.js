const Review = require('../models/review.model');

exports.findAll = (venueId) =>
    Review.find({})

// Find all reviews for a venue with user information
exports.findByVenueWithUser = (venueId) =>
    Review.find({ venue: venueId })
        .populate('user', 'name surname email')
        .sort({ createdAt: -1 })
        .exec();

// Find all reviews for a venue (basic)
exports.findByVenue = (venueId) =>
    Review.find({ venue: venueId })
        .sort({ createdAt: -1 })
        .exec();

// Find reviews by user
exports.findByUser = (userId) =>
    Review.find({ user: userId })
        .populate('venue', 'name category location')
        .sort({ createdAt: -1 })
        .exec();

// Find review by ID
exports.findById = (id) =>
    Review.findById(id)
        .populate('user', 'name surname email')
        .populate('venue', 'name category')
        .exec();

// Create new review
exports.insert = (reviewData) =>
    new Review(reviewData).save();

// Update review
exports.update = (id, updateData) =>
    Review.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .populate('user', 'name surname email')
        .exec();

// Delete review
exports.remove = (id) =>
    Review.findByIdAndDelete(id).then(r => !!r);

// Delete all reviews for a venue
exports.removeByVenue = (venueId) =>
    Review.deleteMany({ venue: venueId }).exec();

// Delete all reviews by user
exports.removeByUser = (userId) =>
    Review.deleteMany({ user: userId }).exec();

// Check if user already reviewed a venue
exports.findUserReviewForVenue = (userId, venueId) =>
    Review.findOne({
        user: userId,
        venue: venueId
    }).exec();

// Count reviews for a venue
exports.countByVenue = (venueId) =>
    Review.countDocuments({ venue: venueId }).exec();