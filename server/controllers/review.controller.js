// Updated server/controllers/review.controller.js
const reviewService = require('../services/review.service');
const { successResponse, errorResponse } = require('../utils/response.utils');

exports.getAllReviews = async (req, res, next) => {
    try {
        const { venue } = req.query;
        const reviews = await reviewService.listReviews(venue);

        return successResponse(res, 'Reviews retrieved successfully', reviews);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.getReviewById = async (req, res, next) => {
    try {
        const review = await reviewService.getReviewById(req.params.id);

        return successResponse(res, 'Review retrieved successfully', review);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.createReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviewData = {
            ...req.body,
            user: userId
        };

        const review = await reviewService.createReview(reviewData);

        return successResponse(res, 'Review created successfully', review, 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.updateReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviewId = req.params.id;

        const review = await reviewService.updateReview(reviewId, req.body, userId);

        return successResponse(res, 'Review updated successfully', review);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviewId = req.params.id;

        await reviewService.deleteReview(reviewId, userId);

        return successResponse(res, 'Review deleted successfully');
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.getVenueReviews = async (req, res, next) => {
    try {
        const { venueId } = req.params;
        const reviews = await reviewService.getVenueReviews(venueId);

        return successResponse(res, 'Venue reviews retrieved successfully', reviews);
    } catch (error) {
        return errorResponse(res, error);
    }
};