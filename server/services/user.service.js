const userRepo = require('../repositories/user.repository');
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
