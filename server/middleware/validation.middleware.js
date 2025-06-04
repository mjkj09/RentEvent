// file: server/middleware/validation.middleware.js
const Joi = require('joi');
const { errorResponse } = require('../utils/response.utils');

// User validation schemas
const userRegistrationSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    surname: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('renter').default('renter') // Only renter allowed at registration
});

const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Company validation schemas
const companySchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    nip: Joi.string().pattern(/^\d{10}$/).required().messages({
        'string.pattern.base': 'NIP must be exactly 10 digits'
    }),
    regon: Joi.string().pattern(/^\d{9}$|^\d{14}$/).required().messages({
        'string.pattern.base': 'REGON must be 9 or 14 digits'
    }),
    address: Joi.object({
        street: Joi.string().min(5).max(100).required(),
        city: Joi.string().min(2).max(50).required(),
        region: Joi.string().valid(
            'Malopolska',
            'Mazowieckie',
            'Dolnoslaskie',
            'Pomorskie',
            'Wielkopolskie',
            'Slaskie',
            'Lubelskie',
            'Podlaskie',
            'Zachodniopomorskie',
            'Lubuskie',
            'Kujawsko-Pomorskie',
            'Lodzkie',
            'Swietokrzyskie',
            'Podkarpackie',
            'Warminsko-Mazurskie'
        ).required()
    }).required()
});

const companyUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    nip: Joi.string().pattern(/^\d{10}$/).messages({
        'string.pattern.base': 'NIP must be exactly 10 digits'
    }),
    regon: Joi.string().pattern(/^\d{9}$|^\d{14}$/).messages({
        'string.pattern.base': 'REGON must be 9 or 14 digits'
    }),
    address: Joi.object({
        street: Joi.string().min(5).max(100),
        city: Joi.string().min(2).max(50),
        region: Joi.string().valid(
            'Malopolska',
            'Mazowieckie',
            'Dolnoslaskie',
            'Pomorskie',
            'Wielkopolskie',
            'Slaskie',
            'Lubelskie',
            'Podlaskie',
            'Zachodniopomorskie',
            'Lubuskie',
            'Kujawsko-Pomorskie',
            'Lodzkie',
            'Swietokrzyskie',
            'Podkarpackie',
            'Warminsko-Mazurskie'
        )
    })
}).min(1); // At least one field must be provided for update

// Venue validation schemas
const venueSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    category: Joi.string().valid(
        'Wedding & Banquet Halls',
        'Conference & Meeting Rooms',
        'Outdoor & Garden Spaces',
        'Clubs & Bars',
        'Lofts & Industrial Venues',
        'Unique & Themed Spaces'
    ).required(),
    location: Joi.object({
        street: Joi.string().min(5).max(100).required(),
        city: Joi.string().min(2).max(50).required(),
        region: Joi.string().valid(
            'Malopolska',
            'Mazowieckie',
            'Dolnoslaskie',
            'Pomorskie',
            'Wielkopolskie',
            'Slaskie',
            'Lubelskie',
            'Podlaskie',
            'Zachodniopomorskie',
            'Lubuskie',
            'Kujawsko-Pomorskie',
            'Lodzkie',
            'Swietokrzyskie',
            'Podkarpackie',
            'Warminsko-Mazurskie'
        ).required()
    }).required(),
    description: Joi.string().min(10).max(2000).required(),
    capacity: Joi.number().integer().min(1).max(10000).required(),
    pricing: Joi.object({
        minPricePerPerson: Joi.number().min(0).allow(null),
        maxPricePerPerson: Joi.number().min(0).allow(null),
        isPriceHidden: Joi.boolean().default(false)
    }).required(),
    images: Joi.array().items(Joi.string().uri()).default([]),
    bannerImage: Joi.string().uri().allow(null)
});

const venueUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    category: Joi.string().valid(
        'Wedding & Banquet Halls',
        'Conference & Meeting Rooms',
        'Outdoor & Garden Spaces',
        'Clubs & Bars',
        'Lofts & Industrial Venues',
        'Unique & Themed Spaces'
    ),
    location: Joi.object({
        street: Joi.string().min(5).max(100),
        city: Joi.string().min(2).max(50),
        region: Joi.string().valid(
            'Malopolska',
            'Mazowieckie',
            'Dolnoslaskie',
            'Pomorskie',
            'Wielkopolskie',
            'Slaskie',
            'Lubelskie',
            'Podlaskie',
            'Zachodniopomorskie',
            'Lubuskie',
            'Kujawsko-Pomorskie',
            'Lodzkie',
            'Swietokrzyskie',
            'Podkarpackie',
            'Warminsko-Mazurskie'
        )
    }),
    description: Joi.string().min(10).max(2000),
    capacity: Joi.number().integer().min(1).max(10000),
    pricing: Joi.object({
        minPricePerPerson: Joi.number().min(0).allow(null),
        maxPricePerPerson: Joi.number().min(0).allow(null),
        isPriceHidden: Joi.boolean()
    }),
    images: Joi.array().items(Joi.string().uri()),
    bannerImage: Joi.string().uri().allow(null),
    isActive: Joi.boolean()
}).min(1);

// Review validation schema
const reviewSchema = Joi.object({
    venue: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid venue ID format'
    }),
    rating: Joi.number().integer().min(1).max(5).required().messages({
        'number.min': 'Rating must be at least 1',
        'number.max': 'Rating must be at most 5',
        'any.required': 'Rating is required'
    }),
    comment: Joi.string().max(1000).allow('').optional().messages({
        'string.max': 'Comment cannot exceed 1000 characters'
    })
});

// User update schema
const userUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    surname: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[+]?[\d\s\-\(\)]{9,15}$/).allow('').messages({
        'string.pattern.base': 'Invalid phone number format'
    }),
    password: Joi.string().min(8)
}).min(1);

// Validation middleware functions
const validateUserRegistration = (req, res, next) => {
    const { error } = userRegistrationSchema.validate(req.body);
    if (error) {
        return errorResponse(res, {
            message: error.details[0].message,
            statusCode: 400
        });
    }
    next();
};

const validateUserLogin = (req, res, next) => {
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
        return errorResponse(res, {
            message: error.details[0].message,
            statusCode: 400
        });
    }
    next();
};

const validateUserUpdate = (req, res, next) => {
    const { error } = userUpdateSchema.validate(req.body);
    if (error) {
        return errorResponse(res, {
            message: error.details[0].message,
            statusCode: 400
        });
    }
    next();
};

const validateCompany = (req, res, next) => {
    const { error } = companySchema.validate(req.body);
    if (error) {
        return errorResponse(res, {
            message: error.details[0].message,
            statusCode: 400
        });
    }
    next();
};

const validateCompanyUpdate = (req, res, next) => {
    const { error } = companyUpdateSchema.validate(req.body);
    if (error) {
        return errorResponse(res, {
            message: error.details[0].message,
            statusCode: 400
        });
    }
    next();
};

const validateVenue = (req, res, next) => {
    const { error } = venueSchema.validate(req.body);
    if (error) {
        return errorResponse(res, {
            message: error.details[0].message,
            statusCode: 400
        });
    }
    next();
};

const validateVenueUpdate = (req, res, next) => {
    const { error } = venueUpdateSchema.validate(req.body);
    if (error) {
        return errorResponse(res, {
            message: error.details[0].message,
            statusCode: 400
        });
    }
    next();
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        return errorResponse(res, {
            message: error.details[0].message,
            statusCode: 400
        });
    }
    next();
};

// MongoDB ObjectId validation helper
const validateObjectId = (paramName) => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return errorResponse(res, {
                message: `Invalid ${paramName} format`,
                statusCode: 400
            });
        }
        next();
    };
};

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateUserUpdate,
    validateCompany,
    validateCompanyUpdate,
    validateVenue,
    validateVenueUpdate,
    validateReview,
    validateObjectId
};