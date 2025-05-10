const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return next(new AppError('Access denied. No token provided.', 401));
        }

        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token expired', 401));
        }
        return next(new AppError('Invalid token', 401));
    }
};

exports.hasRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('Access denied. Not authenticated.', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new AppError('Access denied. Not authorized.', 403));
        }

        next();
    };
};

exports.isOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return next(new AppError('Access denied. Not authenticated.', 401));
    }

    if (req.user.role === 'admin' || req.params.id === req.user.id) {
        return next();
    }

    return next(new AppError('Access denied. Not authorized.', 403));
};