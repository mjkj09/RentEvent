const Joi = require('joi');
const { errorResponse } = require('../utils/response.utils');

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

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateCompany,
    validateCompanyUpdate
};