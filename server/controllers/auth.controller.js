const authService = require('../services/auth.service');
const AppError = require('../utils/AppError');
const userRepo = require('../repositories/user.repository');

exports.register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body, res);
        res.status(201).json({
            data: user,
            message: 'Registration successful.'
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await authService.login(req.body, res);
        res.status(200).json({
            data: user,
            message: 'Logged in successfully.'
        });
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        await authService.logout(refreshToken, res);
        res.status(200).json({
            message: 'Logged out successfully.'
        });
    } catch (err) {
        next(err);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const user = await authService.refreshToken(refreshToken, res);
        res.status(200).json({
            data: user,
            message: 'Token refreshed successfully.'
        });
    } catch (err) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        if (err.statusCode === 401) {
            const sessionError = new AppError('Session expired. Please login again.', 401);
            return next(sessionError);
        }

        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await userRepo.findById(req.user.id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            data: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};
