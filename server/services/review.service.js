const reviewRepo = require('../repositories/review.repository');
const AppError = require('../utils/AppError');

exports.listReviews = (venue) =>
    reviewRepo.findAll(venue);

exports.getReviewById = async (id) => {
    const r = await reviewRepo.findById(id);
    if (!r) {
        throw new AppError('Review not found', 404);
    }
    return r;
};

exports.createReview = (data) =>
    reviewRepo.insert(data);

exports.updateReview = async (id, data) => {
    const updated = await reviewRepo.update(id, data);
    if (!updated) {
        throw new AppError('Review not found', 404);
    }
    return updated;
};

exports.deleteReview = async (id) => {
    const ok = await reviewRepo.remove(id);
    if (!ok) {
        throw new AppError('Review not found', 404);
    }
};
