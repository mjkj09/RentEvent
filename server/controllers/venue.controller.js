const venueService = require('../services/venue.service');

exports.getAllVenues = async (req, res, next) => {
    try {
        const venues = await venueService.listVenues(req.query);
        res.status(200).json(venues);
    } catch (err) {
        next(err);
    }
};

exports.getVenueById = async (req, res, next) => {
    try {
        const venue = await venueService.getVenueById(req.params.id);
        res.status(200).json(venue);
    } catch (err) {
        next(err);
    }
};

exports.createVenue = async (req, res, next) => {
    try {
        const created = await venueService.createVenue(req.body);
        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};

exports.updateVenue = async (req, res, next) => {
    try {
        const updated = await venueService.updateVenue(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

exports.deleteVenue = async (req, res, next) => {
    try {
        await venueService.deleteVenue(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};
