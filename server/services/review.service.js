const reviewRepo = require('../repositories/review.repository');

exports.listReviews = (venue) =>
    reviewRepo.findAll(venue);

exports.getReviewById = async (id) => {
    const r = await reviewRepo.findById(id);
    if (!r) throw new Error('Review not found');
    return r;
};

exports.createReview = (data) =>
    reviewRepo.insert(data);

exports.updateReview = async (id, data) => {
    const r = await reviewRepo.update(id, data);
    if (!r) throw new Error('Review not found');
    return r;
};

exports.deleteReview = async (id) => {
    const ok = await reviewRepo.remove(id);
    if (!ok) throw new Error('Review not found');
};
