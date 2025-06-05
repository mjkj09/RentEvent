const userService = require('../services/user.service');
const { successResponse, errorResponse } = require('../utils/response.utils');

exports.getUserProfile = async (req, res, next) => {
    try {
        const profile = await userService.getUserProfile(req.user.id);
        return successResponse(res, 'Profile retrieved successfully', profile);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const updated = await userService.updateProfile(req.user.id, req.body);
        return successResponse(res, 'Profile updated successfully', updated);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.deleteAccount = async (req, res, next) => {
    try {
        const { password } = req.body;
        const result = await userService.deleteAccount(req.user.id, password);

        // Clear refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return successResponse(res, result.message);
    } catch (error) {
        return errorResponse(res, error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.listUsers();
        res.status(200).json({
            data: users
        });
    } catch (err) {
        next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({
            data: user
        });
    } catch (err) {
        next(err);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json({
            data: newUser,
            message: 'User created successfully.'
        });
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const updated = await userService.updateUser(req.params.id, req.body);
        res.status(200).json({
            data: updated,
            message: 'User updated successfully.'
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).send({
            message: 'User deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
};

exports.getFavorites = async (req, res, next) => {
    try {
        const favs = await userService.getFavorites(req.params.id);
        res.status(200).json({
            data: favs
        });
    } catch (err) {
        next(err);
    }
};

exports.addFavorite = async (req, res, next) => {
    try {
        const user = await userService.addFavorite(req.params.id, req.body.venueId);
        res.status(200).json({
            data: user,
            message: 'Venue added to favorites.'
        });
    } catch (err) {
        next(err);
    }
};

exports.removeFavorite = async (req, res, next) => {
    try {
        const user = await userService.removeFavorite(req.params.id, req.params.venueId);
        res.status(200).json({
            data: user,
            message: 'Venue removed from favorites.'
        });
    } catch (err) {
        next(err);
    }
};
