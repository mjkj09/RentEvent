const venueService = require('../services/venue.service');
const { successResponse, errorResponse } = require('../utils/response.utils');

exports.getMyVenues = async (req, res, next) => {
    try {
        const venues = await venueService.getOwnerVenues(req.user.id);
        return successResponse(res, 'Your venues retrieved successfully', venues);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.getAllVenues = async (req, res, next) => {
    try {
        const venues = await venueService.listVenues(req.query);
        return successResponse(res, 'Venues retrieved successfully', venues);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.getVenueById = async (req, res, next) => {
    try {
        const venue = await venueService.getVenueById(req.params.id);
        return successResponse(res, 'Venue retrieved successfully', venue);
    } catch (error) {
        return errorResponse(res, error);
    }
};

// New method for detailed venue view
exports.getVenueDetails = async (req, res, next) => {
    try {
        const venue = await venueService.getVenueByIdWithDetails(req.params.id);
        return successResponse(res, 'Venue details retrieved successfully', venue);
    } catch (error) {
        return errorResponse(res, error);
    }
};

// New method for category statistics
exports.getCategoryStats = async (req, res, next) => {
    try {
        const stats = await venueService.getCategoryStats();
        return successResponse(res, 'Category statistics retrieved successfully', stats);
    } catch (error) {
        return errorResponse(res, error);
    }
};

// New method for popular venues
exports.getPopularVenues = async (req, res, next) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 6;
        const venues = await venueService.getPopularVenues(limit);
        return successResponse(res, 'Popular venues retrieved successfully', venues);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.createVenue = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const venueData = {
            ...req.body,
            owner: ownerId
        };

        const venue = await venueService.createVenue(venueData);
        return successResponse(res, 'Venue created successfully', venue, 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.updateVenue = async (req, res, next) => {
    try {
        const updated = await venueService.updateVenue(req.params.id, req.body);
        return successResponse(res, 'Venue updated successfully', updated);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.deleteVenue = async (req, res, next) => {
    try {
        await venueService.deleteVenue(req.params.id);
        return successResponse(res, 'Venue deleted successfully');
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.toggleVenueActive = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const userId = req.user.id;

        const updatedVenue = await venueService.toggleVenueActive(id, userId, isActive);
        return successResponse(res, `Venue ${isActive ? 'activated' : 'deactivated'} successfully`, updatedVenue);
    } catch (error) {
        return errorResponse(res, error);
    }
};

// Image upload handler
exports.uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return errorResponse(res, { message: 'No image file provided', statusCode: 400 });
        }

        // Return full URL for the uploaded image
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imagePath = `/uploads/venues/${req.file.filename}`;
        const fullImageUrl = `${baseUrl}${imagePath}`;

        return successResponse(res, 'Image uploaded successfully', { imageUrl: fullImageUrl });
    } catch (error) {
        return errorResponse(res, error);
    }
};