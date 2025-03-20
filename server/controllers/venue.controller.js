const Venue = require('../models/venue.model');

// [GET] /api/venues
exports.getAllVenues = async (req, res) => {
    try {
        const venues = await Venue.find();
        res.status(200).json(venues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// [GET] /api/venues/:id
exports.getVenueById = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }
        res.status(200).json(venue);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// [POST] /api/venues
exports.createVenue = async (req, res) => {
    try {
        const venue = await Venue.create(req.body);
        res.status(201).json(venue);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// [PUT] /api/venues/:id
exports.updateVenue = async (req, res) => {
    try {
        const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }
        res.status(200).json(venue);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// [DELETE] /api/venues/:id
exports.deleteVenue = async (req, res) => {
    try {
        const venue = await Venue.findByIdAndDelete(req.params.id);
        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
