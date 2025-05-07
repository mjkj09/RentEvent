const bcrypt = require('bcryptjs');
const userRepo = require('../repositories/user.repository');

exports.register = async ({ name, surname, email, password }) => {
    const exists = await userRepo.findByEmail(email);
    if (exists) {
        throw new Error('Email already in use');
    }

    const hash = await bcrypt.hash(password, 12);

    const u = await userRepo.insert({ name, surname, email, password: hash });

    return {
        id: u._id,
        name: u.name,
        surname: u.surname,
        email: u.email,
        role: u.role
    };
};

exports.login = async ({ email, password }) => {
    const u = await userRepo.findByEmail(email);
    if (!u) {
        throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, u.password);
    if (!valid) {
        throw new Error('Invalid credentials');
    }

    return {
        id: u._id,
        name: u.name,
        surname: u.surname,
        email: u.email,
        role: u.role
    };
};
