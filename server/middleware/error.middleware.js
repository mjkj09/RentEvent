module.exports = (err, req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error(err.stack);

    res.status(statusCode).json({
        status: statusCode < 500 ? 'fail' : 'error',
        message
    });
};
