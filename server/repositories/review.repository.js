const Review = require('../models/review.model');

exports.findAll = (venue) => {
    const f = venue ? { venue } : {};
    return Review.find(f)
        .populate('user', 'name surname')
        .populate('venue', 'name')
        .exec();
};

exports.findById = (id) =>
    Review.findById(id)
        .populate('user', 'name surname')
        .populate('venue', 'name')
        .exec();

exports.insert = (data) =>
    new Review(data).save();

exports.update = (id, data) =>
    Review.findByIdAndUpdate(id, data, { new: true }).exec();

exports.remove = (id) =>
    Review.findByIdAndDelete(id).then(r => !!r);
