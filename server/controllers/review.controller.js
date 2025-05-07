const reviewService = require('../services/review.service');

exports.getAllReviews = async (req, res, next) => {
    try {
        const reviews = await reviewService.listReviews(req.query.venue);
        res.status(200).json(reviews);
    } catch (err) {
        next(err);
    }
};

exports.getReviewById = async (req, res, next) => {
    try {
        const review = await reviewService.getReviewById(req.params.id);
        res.status(200).json(review);
    } catch (err) {
        next(err);
    }
};

exports.createReview = async (req, res, next) => {
    try {
        const created = await reviewService.createReview(req.body);
        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};

exports.updateReview = async (req, res, next) => {
    try {
        const updated = await reviewService.updateReview(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        await reviewService.deleteReview(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
