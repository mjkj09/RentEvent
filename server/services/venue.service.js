const venueRepo = require('../repositories/venue.repository');
const reviewRepository = require('../repositories/review.repository');
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

// New method for detailed venue with reviews and owner info
exports.getVenueByIdWithDetails = async (id) => {
    const venue = await venueRepo.findByIdWithOwner(id);
    if (!venue) {
        throw new AppError('Venue not found', 404);
    }

    // Get reviews for this venue with user info
    const reviews = await reviewRepository.findByVenueWithUser(id);

    // Calculate rating statistics
    const ratingStats = {
        averageRating: 0,
        totalReviews: reviews.length,
        ratingDistribution: {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        }
    };

    if (reviews.length > 0) {
        // Calculate average
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        ratingStats.averageRating = Number((totalRating / reviews.length).toFixed(1));

        // Calculate distribution
        reviews.forEach(review => {
            ratingStats.ratingDistribution[review.rating]++;
        });
    }

    // Get owner company info
    const ownerCompany = await companyRepository.findByOwnerId(venue.owner._id);

    return {
        ...venue.toObject(),
        reviews,
        ratingStats,
        ownerCompany: ownerCompany ? {
            name: ownerCompany.name,
            contactEmail: ownerCompany.contactEmail,
            contactPhone: ownerCompany.contactPhone,
            website: ownerCompany.website
        } : null
    };
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