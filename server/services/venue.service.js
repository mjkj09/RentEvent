const venueRepo = require('../repositories/venue.repository');
const companyRepository = require('../repositories/company.repository');
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

exports.createVenue = async (data) => {
    // Validate that owner has a company
    const company = await companyRepository.findByOwnerId(data.owner);
    if (!company) {
        throw new AppError('Owner must have a registered company to create venues', 400);
    }

    // Add company reference to venue data
    const venueData = {
        ...data,
        company: company._id,
        isActive: true
    };

    return await venueRepo.insert(venueData);
};

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