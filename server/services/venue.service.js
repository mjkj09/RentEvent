const venueRepo = require('../repositories/venue.repository');
const AppError = require('../utils/AppError');

exports.listVenues = (filters) =>
    venueRepo.findAll(filters);

exports.getVenueById = async (id) => {
    const v = await venueRepo.findById(id);
    if (!v) {
        throw new AppError('Venue not found', 404);
    }
    return v;
};

exports.createVenue = async (data) =>
    venueRepo.insert(data);

exports.updateVenue = async (id, data) => {
    const updated = await venueRepo.update(id, data);
    if (!updated) {
        throw new AppError('Venue not found', 404);
    }
    return updated;
};

exports.deleteVenue = async (id) => {
    const ok = await venueRepo.remove(id);
    if (!ok) {
        throw new AppError('Venue not found', 404);
    }
};
