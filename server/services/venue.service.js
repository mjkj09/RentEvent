const venueRepo = require('../repositories/venue.repository');
const reviewRepository = require('../repositories/review.repository');
const companyRepository = require('../repositories/company.repository');
const Venue = require('../models/venue.model');
const AppError = require('../utils/AppError');

exports.getOwnerVenues = async (ownerId) => {
    const venues = await venueRepo.findAll({ owner: ownerId });

    // Get rating stats for each venue
    return await Promise.all(
        venues.map(async (venue) => {
            const reviews = await reviewRepository.findByVenue(venue._id);

            const ratingStats = {
                averageRating: 0,
                totalReviews: reviews.length,
                ratingDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            };

            if (reviews.length > 0) {
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                ratingStats.averageRating = Number((totalRating / reviews.length).toFixed(1));

                reviews.forEach(review => {
                    ratingStats.ratingDistribution[review.rating]++;
                });
            }

            return {
                ...venue.toObject(),
                ratingStats
            };
        })
    );
};

// Updated to handle real filtering and searching
exports.listVenues = async (filters = {}) => {
    const {
        search,
        category,
        categories,
        region,
        minPrice,
        maxPrice,
        minCapacity,
        maxCapacity,
        minRating,
        sort,
        page = 1,
        limit = 50
    } = filters;

    // Build MongoDB query
    let query = { isActive: true };

    // Text search across multiple fields
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { 'location.city': { $regex: search, $options: 'i' } },
            { 'location.region': { $regex: search, $options: 'i' } }
        ];
    }

    // Category filter
    if (category) {
        query.category = category;
    } else if (categories) {
        const categoryArray = Array.isArray(categories) ? categories : categories.split(',');
        query.category = { $in: categoryArray };
    }

    // Region filter
    if (region && region !== 'All Poland') {
        query['location.region'] = region;
    }

    // Price range filter
    if (minPrice || maxPrice) {
        query.$and = query.$and || [];

        if (minPrice) {
            query.$and.push({
                $or: [
                    { 'pricing.isPriceHidden': true },
                    { 'pricing.minPricePerPerson': { $gte: parseFloat(minPrice) } }
                ]
            });
        }

        if (maxPrice) {
            query.$and.push({
                $or: [
                    { 'pricing.isPriceHidden': true },
                    { 'pricing.maxPricePerPerson': { $lte: parseFloat(maxPrice) } },
                    {
                        $and: [
                            { 'pricing.maxPricePerPerson': null },
                            { 'pricing.minPricePerPerson': { $lte: parseFloat(maxPrice) } }
                        ]
                    }
                ]
            });
        }
    }

    // Capacity filter
    if (minCapacity) {
        query.capacity = { ...query.capacity, $gte: parseInt(minCapacity) };
    }
    if (maxCapacity) {
        query.capacity = { ...query.capacity, $lte: parseInt(maxCapacity) };
    }

    // Rating filter
    if (minRating) {
        query.rating = { $gte: parseFloat(minRating) };
    }

    // Build sort object
    let sortObject;
    switch (sort) {
        case 'price-low':
            sortObject = { 'pricing.minPricePerPerson': 1, name: 1 };
            break;
        case 'price-high':
            sortObject = { 'pricing.maxPricePerPerson': -1, 'pricing.minPricePerPerson': -1, name: 1 };
            break;
        case 'rating':
            sortObject = { rating: -1, reviews: -1, name: 1 };
            break;
        case 'reviews':
            sortObject = { reviews: -1, rating: -1, name: 1 };
            break;
        default:
            sortObject = { createdAt: -1, name: 1 };
    }

    // Execute query with proper Mongoose query builder
    const venues = await Venue.find(query)
        .populate('owner', 'name surname phone')
        .populate('company', 'name')
        .sort(sortObject)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    return venues;
};

// Get category statistics for home page
exports.getCategoryStats = async () => {
    const stats = await venueRepo.countByCategory();

    // Convert to object for easier frontend consumption
    const categoryStats = {};
    stats.forEach(stat => {
        categoryStats[stat._id] = stat.count;
    });

    return categoryStats;
};

// Get popular venues for home page
exports.getPopularVenues = async (limit = 6) => {
    const venues = await venueRepo.findPopular(limit);

    // Add rating stats for each venue
    return await Promise.all(
        venues.map(async (venue) => {
            const reviews = await reviewRepository.findByVenue(venue._id);

            const ratingStats = {
                averageRating: 0,
                totalReviews: reviews.length
            };

            if (reviews.length > 0) {
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                ratingStats.averageRating = Number((totalRating / reviews.length).toFixed(1));
            }

            return {
                ...venue.toObject(),
                ratingStats
            };
        })
    );
};

// Get user's favorite venues
exports.getFavoriteVenues = async (venueIds) => {
    if (!venueIds || venueIds.length === 0) {
        return [];
    }

    const venues = await venueRepo.findByIds(venueIds);

    // Add rating stats for each venue
    return await Promise.all(
        venues.map(async (venue) => {
            const reviews = await reviewRepository.findByVenue(venue._id);

            const ratingStats = {
                averageRating: 0,
                totalReviews: reviews.length
            };

            if (reviews.length > 0) {
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                ratingStats.averageRating = Number((totalRating / reviews.length).toFixed(1));
            }

            return {
                ...venue.toObject(),
                ratingStats
            };
        })
    );
};

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
        isActive: true,
        rating: 0,    // Initialize with 0
        reviews: 0    // Initialize with 0
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


exports.toggleVenueActive = async (venueId, userId, isActive) => {
    const venue = await venueRepo.findById(venueId);
    if (!venue) {
        throw new AppError('Venue not found', 404);
    }

    // Handle both cases: venue.owner might be just ObjectId or populated object
    let venueOwnerId;
    if (typeof venue.owner === 'object' && venue.owner._id) {
        // If owner is populated object, get the _id
        venueOwnerId = venue.owner._id.toString();
    } else {
        // If owner is just ObjectId
        venueOwnerId = venue.owner.toString();
    }

    const userIdString = userId.toString();

    if (venueOwnerId !== userIdString) {
        throw new AppError('Unauthorized - you can only manage your own venues', 403);
    }

    const updatedVenue = await venueRepo.update(venueId, { isActive });
    return updatedVenue;
};

exports.updateVenueRating = async (venueId, rating, reviewCount) => {
    try {
        const venue = await venueRepo.updateById(venueId, {
            rating: rating,
            reviews: reviewCount,
            updatedAt: new Date()
        });

        if (!venue) {
            throw new AppError('Venue not found', 404);
        }

        return venue;
    } catch (error) {
        throw error;
    }
};