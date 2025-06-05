const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
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

    await tokenRepo.removeAllUserTokens(user._id);

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

const validatePassword = (password) => {
    if (!password) {
        throw new AppError('Password is required', 400);
    }

    if (password.length < 8) {
        throw new AppError('Password must be at least 8 characters long', 400);
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
    })) {
        throw new AppError('Password must contain at least one uppercase letter, one lowercase letter, and one number', 400);
    }

    return true;
};

exports.register = async ({name, surname, email, password, role}, res) => {
    const exists = await userRepo.findByEmail(email);
    if (exists) {
        throw new AppError('Email already in use', 409);
    }

    validatePassword(password);

    const hash = await bcrypt.hash(password, 12);
    const u = await userRepo.insert({name, surname, email, password: hash, role});

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

    let tokenDoc;
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        tokenDoc = await tokenRepo.findByToken(refreshToken);

        if (!tokenDoc || tokenDoc.userId.toString() !== decoded.id) {
            throw new AppError('Invalid refresh token', 401);
        }
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            throw new AppError('Invalid or expired refresh token', 401);
        }
        throw error;
    }

    const user = await userRepo.findById(tokenDoc.userId);
    if (!user) {
        await tokenRepo.remove(refreshToken);
        throw new AppError('User not found', 401);
    }

    await tokenRepo.remove(refreshToken);

    const accessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    setTokenCookies(res, accessToken, newRefreshToken);

    return {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role
    };
};