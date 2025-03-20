const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// [POST] /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            surname,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                surname: newUser.surname,
                email: newUser.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// [POST] /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        return res.status(200).json({
            message: 'Logged in successfully',
            user: {
                _id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// [POST] /api/auth/logout
exports.logout = async (req, res) => {
    try {
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
