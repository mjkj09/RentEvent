const AppError = require('./AppError');

/**
 * Standardized success response utility
 */
const successResponse = (res, message, data = null, statusCode = 200) => {
    const response = {
        success: true,
        message
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

/**
 * Standardized error response utility - uses your existing AppError
 */
const errorResponse = (res, error) => {
    let statusCode = 500;
    let message = 'Internal server error';

    // Handle your existing AppError
    if (error instanceof AppError || error.statusCode) {
        statusCode = error.statusCode;
        message = error.message;
    }
    // Handle mongoose validation errors
    else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(error.errors).map(err => err.message).join(', ');
    }
    // Handle mongoose duplicate key errors
    else if (error.code === 11000) {
        statusCode = 400;
        const field = Object.keys(error.keyPattern)[0];
        message = `${field} already exists`;
    }
    // Handle mongoose cast errors
    else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }
    // Handle standard Error objects
    else if (error instanceof Error) {
        message = error.message;
    }

    // Use your existing error response structure
    const response = {
        success: false,
        error: {
            message
        }
    };

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development' && error.stack) {
        console.error(error.stack);
    }

    return res.status(statusCode).json(response);
};

module.exports = {
    successResponse,
    errorResponse
};