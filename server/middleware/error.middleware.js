module.exports = (err, req, res, _next) => {
    const statusCode = err.statusCode || 500;

    const message = err.isOperational
        ? err.message
        : 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            message
        }
    });
};