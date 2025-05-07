const User = require('../models/user.model');

exports.findAll = () =>
    User.find().exec();

exports.findById = (id) =>
    User.findById(id).populate('favorites').exec();

exports.findByEmail = (email) =>
    User.findOne({ email }).exec();

exports.insert = (data) =>
    new User(data).save();

exports.update = (id, data) =>
    User.findByIdAndUpdate(id, data, { new: true }).exec();

exports.remove = (id) =>
    User.findByIdAndDelete(id).then(r => !!r);

exports.getFavorites = (id) =>
    User.findById(id).populate('favorites').then(u => u.favorites);

exports.addFavorite = (id, venueId) =>
    User.findByIdAndUpdate(id, { $addToSet: { favorites: venueId } }, { new: true }).exec();

exports.removeFavorite = (id, venueId) =>
    User.findByIdAndUpdate(id, { $pull: { favorites: venueId } }, { new: true }).exec();
