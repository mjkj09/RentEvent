const Venue = require('../models/venue.model');

exports.findAll = ({ page = 1, limit = 10, ...f }) =>
    Venue.find(f)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

exports.findById = (id) =>
    Venue.findById(id).populate('owner', 'name surname phone').exec();

exports.findByIdWithOwner = (id) =>
    Venue.findById(id)
        .populate('owner', 'name surname email role phone')
        .populate('company', 'name nip')
        .exec();

// New method for getting venues with filters and sorting
exports.findWithFilters = (filters = {}) => {
    const query = Venue.find(filters);

    return query
        .populate('owner', 'name surname phone')
        .populate('company', 'name')
        .exec();
};

// Get venues by category with count
exports.countByCategory = () =>
    Venue.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

// Get popular venues (by review count)
exports.findPopular = (limit = 6) =>
    Venue.find({ isActive: true })
        .sort({ reviews: -1, rating: -1 })
        .limit(limit)
        .populate('owner', 'name surname')
        .exec();

// Get venues by IDs (for favorites)
exports.findByIds = (venueIds) =>
    Venue.find({ _id: { $in: venueIds }, isActive: true })
        .populate('owner', 'name surname phone')
        .populate('company', 'name')
        .exec();

exports.insert = (data) =>
    new Venue(data).save();

exports.update = (id, data) =>
    Venue.findByIdAndUpdate(id, data, { new: true }).exec();

exports.updateById = (id, updateData) =>
    Venue.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
        .populate('owner', 'name surname email phone')
        .populate('company', 'name nip')
        .exec();

exports.remove = (id) =>
    Venue.findByIdAndDelete(id).then(r => !!r);