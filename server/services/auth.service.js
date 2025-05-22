const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/user.repository');
const tokenRepo = require('../repositories/token.repository');
const AppError = require('../utils/AppError');

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {expiresIn: '15m'}
    );
};

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign(
        {id: user._id},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: '30d'}
    );

    await tokenRepo.create({
        userId: user._id,
        token: refreshToken
    });

    return refreshToken;
};

const setTokenCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

exports.register = async ({name, surname, email, password}, res) => {
    const exists = await userRepo.findByEmail(email);
    if (exists) {
        throw new AppError('Email already in use', 409);
    }

    const hash = await bcrypt.hash(password, 12);
    const u = await userRepo.insert({name, surname, email, password: hash});

    const accessToken = generateAccessToken(u);
    const refreshToken = await generateRefreshToken(u);

    setTokenCookies(res, accessToken, refreshToken);

    return {
        id: u._id,
        name: u.name,
        surname: u.surname,
        email: u.email,
        role: u.role
    };
};

exports.login = async ({email, password}, res) => {
    const u = await userRepo.findByEmail(email);
    if (!u) {
        throw new AppError('Invalid credentials', 401);
    }

    const valid = await bcrypt.compare(password, u.password);
    if (!valid) {
        throw new AppError('Invalid credentials', 401);
    }

    const accessToken = generateAccessToken(u);
    const refreshToken = await generateRefreshToken(u);

    setTokenCookies(res, accessToken, refreshToken);

    return {
        id: u._id,
        name: u.name,
        surname: u.surname,
        email: u.email,
        role: u.role
    };
};

exports.logout = async (refreshToken, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    if (refreshToken) {
        await tokenRepo.remove(refreshToken);
    }
};

exports.refreshToken = async (refreshToken, res) => {
    if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
    }

    const tokenDoc = await tokenRepo.findByToken(refreshToken);
    if (!tokenDoc) {
        throw new AppError('Invalid refresh token', 401);
    }

    const user = await userRepo.findById(tokenDoc.userId);
    if (!user) {
        await tokenRepo.remove(refreshToken);
        throw new AppError('User not found', 401);
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    await tokenRepo.remove(refreshToken);

    setTokenCookies(res, accessToken, newRefreshToken);

    return {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role
    };
};
