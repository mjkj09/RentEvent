// Updated server/services/review.service.js
const reviewRepo = require('../repositories/review.repository');
const venueService = require('./venue.service');
const AppError = require('../utils/AppError');

exports.listReviews = async (venueId) => {
    if (venueId) {
        return await reviewRepo.findByVenueWithUser(venueId);
    }
    return await reviewRepo.findAll();
};

exports.getReviewById = async (id) => {
    const review = await reviewRepo.findById(id);
    if (!review) {
        throw new AppError('Review not found', 404);
    }
    return review;
};

exports.createReview = async (reviewData) => {
    const { user, venue, rating, comment } = reviewData;

    // Check if venue exists
    const venueExists = await venueService.getVenueById(venue);
    if (!venueExists) {
        throw new AppError('Venue not found', 404);
    }

    // Check if user is trying to review their own venue
    if (venueExists.owner._id.toString() === user.toString()) {
        throw new AppError('You cannot review your own venue', 403);
    }

    // Check if user already reviewed this venue
    const existingReview = await reviewRepo.findUserReviewForVenue(user, venue);
    if (existingReview) {
        throw new AppError('You have already reviewed this venue', 400);
    }

    // Create the review
    const review = await reviewRepo.insert({
        user,
        venue,
        rating,
        comment: comment || ''
    });

    // Update venue rating statistics
    await this.updateVenueRatingStats(venue);

    return review;
};

exports.updateReview = async (id, updateData, userId) => {
    const review = await reviewRepo.findById(id);
    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Check if user owns this review
    if (review.user._id.toString() !== userId.toString()) {
        throw new AppError('You can only update your own reviews', 403);
    }

    const updatedReview = await reviewRepo.update(id, updateData);

    // Update venue rating statistics
    await this.updateVenueRatingStats(review.venue);

    return updatedReview;
};

exports.deleteReview = async (id, userId) => {
    const review = await reviewRepo.findById(id);
    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Check if user owns this review
    if (review.user._id.toString() !== userId.toString()) {
        throw new AppError('You can only delete your own reviews', 403);
    }

    const venueId = review.venue;
    await reviewRepo.remove(id);

    // Update venue rating statistics
    await this.updateVenueRatingStats(venueId);
};

exports.getVenueReviews = async (venueId) => {
    return await reviewRepo.findByVenueWithUser(venueId);
};

// Helper function to update venue rating statistics
exports.updateVenueRatingStats = async (venueId) => {
    const reviews = await reviewRepo.findByVenue(venueId);

    if (reviews.length === 0) {
        // No reviews, set default values
        await venueService.updateVenueRating(venueId, 0, 0);
        return;
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    const reviewCount = reviews.length;

    // Update venue with new stats
    await venueService.updateVenueRating(venueId, averageRating, reviewCount);
};