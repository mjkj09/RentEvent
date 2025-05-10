const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body, res);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await authService.login(req.body, res);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user
        });
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const result = await authService.logout(refreshToken, res);
        res.status(200).json({
            success: true,
            message: result.message
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
            success: true,
            message: 'Token refreshed successfully',
            user
        });
    } catch (err) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        if (err.statusCode === 401) {
            return res.status(401).json({
                success: false,
                message: 'Session expired. Please login again.',
                isSessionExpired: true
            });
        }

        next(err);
    }
};

exports.getMe = async (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    });
};
