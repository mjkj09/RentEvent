const Review = require('../models/review.model');

// [POST] /api/reviews
exports.createReview = async (req, res) => {
    try {
        const newReview = await Review.create(req.body);
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// [GET] /api/reviews
exports.getAllReviews = async (req, res) => {
    try {
        const { venue } = req.query;
        let filter = {};

        if (venue) {
            filter.venue = venue;
        }

        const reviews = await Review.find(filter)
            .populate('user', 'name surname')
            .populate('venue', 'name');

        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// [GET] /api/reviews/:id
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('user', 'name surname')
            .populate('venue', 'name');
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// [PUT] /api/reviews/:id
exports.updateReview = async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('user', 'name surname')
            .populate('venue', 'name');

        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json(updatedReview);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// [DELETE] /api/reviews/:id
exports.deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
