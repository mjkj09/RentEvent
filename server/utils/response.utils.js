/**
 * Standardized success response utility - compatible with existing structure
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Object} data - Response data (optional)
 * @param {number} statusCode - HTTP status code (default: 200)
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
 * Standardized error response utility - compatible with existing AppError
 * @param {Object} res - Express response object
 * @param {Object|Error} error - Error object or custom error
 */
const errorResponse = (res, error) => {
    let statusCode = 500;
    let message = 'Internal server error';

    // Handle AppError (your existing error class)
    if (error.statusCode) {
        statusCode = error.statusCode;
        message = error.message;
    }
    // Handle standard Error objects
    else if (error instanceof Error) {
        message = error.message;
        // Try to extract status code from common error patterns
        if (error.message.includes('not found') || error.message.includes('Not found')) {
            statusCode = 404;
        } else if (error.message.includes('already exists') || error.message.includes('duplicate')) {
            statusCode = 400;
        } else if (error.message.includes('unauthorized') || error.message.includes('Unauthorized')) {
            statusCode = 401;
        } else if (error.message.includes('forbidden') || error.message.includes('Forbidden')) {
            statusCode = 403;
        }
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

    // Use your existing error structure
    const response = {
        success: false,
        error: {
            message
        }
    };

    // Add stack trace in development (compatible with your existing structure)
    if (process.env.NODE_ENV === 'development' && error.stack) {
        response.error.stack = error.stack;
    }

    return res.status(statusCode).json(response);
};

module.exports = {
    successResponse,
    errorResponse
};