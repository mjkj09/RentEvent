const venueService = require('../services/venue.service');
const { successResponse, errorResponse } = require('../utils/response.utils');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/venues/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'venue-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'));
        }
    }
});

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

exports.uploadImage = async (req, res, next) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            return errorResponse(res, { message: err.message, statusCode: 400 });
        }

        if (!req.file) {
            return errorResponse(res, { message: 'No image file provided', statusCode: 400 });
        }

        // Return the file path relative to public folder
        const imagePath = `/uploads/venues/${req.file.filename}`;
        return successResponse(res, 'Image uploaded successfully', imagePath);
    });
};