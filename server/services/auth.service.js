const bcrypt = require('bcryptjs');
const userRepo = require('../repositories/user.repository');
const AppError = require('../utils/AppError');

exports.register = async ({name, surname, email, password}) => {
    const exists = await userRepo.findByEmail(email);
    if (exists) {
        throw new AppError('Email already in use', 409);
    }

    const hash = await bcrypt.hash(password, 12);
    const u = await userRepo.insert({name, surname, email, password: hash});

    return {
        id: u._id,
        name: u.name,
        surname: u.surname,
        email: u.email,
        role: u.role
    };
};

exports.login = async ({email, password}) => {
    const u = await userRepo.findByEmail(email);
    if (!u) {
        throw new AppError('Invalid credentials', 401);
    }

    const valid = await bcrypt.compare(password, u.password);
    if (!valid) {
        throw new AppError('Invalid credentials', 401);
    }

    return {
        id: u._id,
        name: u.name,
        surname: u.surname,
        email: u.email,
        role: u.role
    };
};
