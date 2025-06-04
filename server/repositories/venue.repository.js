const Venue = require('../models/venue.model');

exports.findAll = ({ page = 1, limit = 10, ...f }) =>
    Venue.find(f)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

exports.findById = (id) =>
    Venue.findById(id).populate('owner', 'name surname phone').exec();

// New method for detailed venue view with owner info - FIXED: added phone field
exports.findByIdWithOwner = (id) =>
    Venue.findById(id)
        .populate('owner', 'name surname email role phone')  // Added phone here
        .populate('company', 'name contactEmail contactPhone website')
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