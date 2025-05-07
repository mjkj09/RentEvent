const userRepo = require('../repositories/user.repository');

exports.listUsers = () =>
    userRepo.findAll();

exports.getUserById = async (id) => {
    const u = await userRepo.findById(id);
    if (!u) throw new Error('User not found');
    return u;
};

exports.createUser = (data) =>
    userRepo.insert(data);

exports.updateUser = async (id, data) => {
    const u = await userRepo.update(id, data);
    if (!u) throw new Error('User not found');
    return u;
};

exports.deleteUser = async (id) => {
    const ok = await userRepo.remove(id);
    if (!ok) throw new Error('User not found');
};

exports.getFavorites = (id) =>
    userRepo.getFavorites(id);

exports.addFavorite = (id, venueId) =>
    userRepo.addFavorite(id, venueId);

exports.removeFavorite = (id, venueId) =>
    userRepo.removeFavorite(id, venueId);
