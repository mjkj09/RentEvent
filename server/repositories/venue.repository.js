const Venue = require('../models/venue.model');

exports.findAll = ({ page = 1, limit = 10, ...f }) =>
    Venue.find(f)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

exports.findById = (id) =>
    Venue.findById(id).populate('owner', 'name surname').exec();

exports.insert = (data) =>
    new Venue(data).save();

exports.update = (id, data) =>
    Venue.findByIdAndUpdate(id, data, { new: true }).exec();

exports.remove = (id) =>
    Venue.findByIdAndDelete(id).then(r => !!r);
