const AppError = require('./AppError');

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

const errorResponse = (res, error) => {
    let statusCode = 500;
    let message = 'Internal server error';

    // Handle AppError
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
    // Handle standard errors
    else if (error instanceof Error) {
        message = error.message;
    }

    const response = {
        success: false,
        error: { message }
    };



    return res.status(statusCode).json(response);
};

module.exports = {
    successResponse,
    errorResponse
};