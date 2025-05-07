const venueRepo = require('../repositories/venue.repository');

exports.listVenues = (filters) =>
    venueRepo.findAll(filters);

exports.getVenueById = async (id) => {
    const v = await venueRepo.findById(id);
    if (!v) throw new Error('Venue not found');
    return v;
};

exports.createVenue = async (data) => {
    return await venueRepo.insert(data);
};

exports.updateVenue = async (id, data) => {
    const updated = await venueRepo.update(id, data);
    if (!updated) throw new Error('Venue not found');
    return updated;
};

exports.deleteVenue = async (id) => {
    const ok = await venueRepo.remove(id);
    if (!ok) throw new Error('Venue not found');
};
