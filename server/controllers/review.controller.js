const reviewService = require('../services/review.service');

exports.getAllReviews = async (req, res, next) => {
    try {
        const reviews = await reviewService.listReviews(req.query.venue);
        res.status(200).json({
            data: reviews
        });
    } catch (err) {
        next(err);
    }
};

exports.getReviewById = async (req, res, next) => {
    try {
        const review = await reviewService.getReviewById(req.params.id);
        res.status(200).json({
            data: review
        });
    } catch (err) {
        next(err);
    }
};

exports.createReview = async (req, res, next) => {
    try {
        const created = await reviewService.createReview(req.body);
        res.status(201).json({
            data: created,
            message: 'Review created successfully.'
        });
    } catch (err) {
        next(err);
    }
};

exports.updateReview = async (req, res, next) => {
    try {
        const updated = await reviewService.updateReview(req.params.id, req.body);
        res.status(200).json({
            data: updated,
            message: 'Review updated successfully.'
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        await reviewService.deleteReview(req.params.id);
        res.status(204).send({
            message: 'Review deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
};
