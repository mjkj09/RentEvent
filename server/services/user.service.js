const userRepo = require('../repositories/user.repository');
const companyRepo = require('../repositories/company.repository');
const venueService = require('./venue.service');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');

exports.listUsers = () =>
    userRepo.findAll();

exports.getUserById = async (id) => {
    const u = await userRepo.findById(id);
    if (!u) {
        throw new AppError('User not found', 404);
    }
    return u;
};

exports.createUser = (data) =>
    userRepo.insert(data);

exports.updateUser = async (id, data) => {
    const u = await userRepo.update(id, data);
    if (!u) {
        throw new AppError('User not found', 404);
    }
    return u;
};

exports.deleteUser = async (id) => {
    const ok = await userRepo.remove(id);
    if (!ok) {
        throw new AppError('User not found', 404);
    }
};

// Updated favorites methods
exports.getFavorites = (id) =>
    userRepo.getFavorites(id);

exports.addFavorite = async (id, venueId) => {
    try {
        return await userRepo.addFavorite(id, venueId);
    } catch {
        throw new AppError('Unable to add favorite', 400);
    }
};

exports.removeFavorite = async (id, venueId) => {
    try {
        return await userRepo.removeFavorite(id, venueId);
    } catch {
        throw new AppError('Unable to remove favorite', 400);
    }
};

// New method to get favorite venues with full details
exports.getFavoriteVenues = async (userId) => {
    const user = await userRepo.findById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (!user.favorites || user.favorites.length === 0) {
        return [];
    }

    // Get full venue details for favorites
    return await venueService.getFavoriteVenues(user.favorites);
};

// Check if a venue is in user's favorites
exports.checkFavorite = async (userId, venueId) => {
    const user = await userRepo.findById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (!user.favorites || user.favorites.length === 0) {
        return false;
    }

    // Convert venue ID to string for comparison
    const venueIdString = venueId.toString();

    const isFavorite = user.favorites.some(favorite => {
        // Handle both cases: favorite might be just an ID or a full object
        let favoriteId;

        if (typeof favorite === 'object' && favorite !== null) {
            // If favorite is an object, get its _id
            favoriteId = favorite._id ? favorite._id.toString() : favorite.toString();
        } else {
            // If favorite is already an ID
            favoriteId = favorite.toString();
        }

        return favoriteId === venueIdString;
    });

    return isFavorite;
};

// Nowe funkcje dla profilu
exports.getUserProfile = async (id) => {
    const user = await userRepo.findById(id);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Get company info if user is owner
    let company = null;
    if (user.role === 'owner') {
        company = await companyRepo.findByOwnerId(id);
    }

    return {
        user: {
            _id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt
        },
        company
    };
};

exports.updateProfile = async (id, updateData) => {
    const { name, surname, email, phone, currentPassword, newPassword } = updateData;

    // Find user with password
    const user = await userRepo.findById(id);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
        const existingUser = await userRepo.findByEmail(email);
        if (existingUser && existingUser._id.toString() !== id) {
            throw new AppError('Email is already taken', 400);
        }
    }

    const updateFields = { name, surname, email, phone };

    // If password is being changed
    if (newPassword) {
        if (!currentPassword) {
            throw new AppError('Current password is required to set new password', 400);
        }

        // Get user with password to verify
        const userWithPassword = await User.findById(id).select('+password');
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.password);
        if (!isCurrentPasswordValid) {
            throw new AppError('Current password is incorrect', 400);
        }

        // Hash new password
        const saltRounds = 12;
        updateFields.password = await bcrypt.hash(newPassword, saltRounds);
    }

    const updatedUser = await userRepo.update(id, updateFields);

    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
};

exports.deleteAccount = async (id, password) => {
    const user = await User.findById(id).select('+password');
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError('Password is incorrect', 400);
    }

    // Delete associated company if exists
    if (user.role === 'owner') {
        await companyRepo.deleteByOwnerId(id);
    }

    const deleted = await userRepo.remove(id);
    if (!deleted) {
        throw new AppError('Failed to delete account', 500);
    }

    return { message: 'Account deleted successfully' };
};