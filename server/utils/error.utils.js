/**
 * Custom application error class
 */
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';

        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Handle async errors in route handlers
 * @param {Function} fn - Async function to wrap
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    AppError,
    catchAsync
};