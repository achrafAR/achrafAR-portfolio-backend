import User from '../models/user-models.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';

const generateToken = (userId) => {
    const expiresIn = process.env.JWT_EXPIRES_IN; // Get the expiration time from environment variable
    const expirationSeconds = parseExpiration(expiresIn);

    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: expirationSeconds
    });
};

const parseExpiration = (expiration) => {
    const unit = expiration.slice(-1);
    const value = parseInt(expiration.slice(0, -1));
    
    switch (unit) {
        case 's':
            return value;
        case 'm':
            return value * 60;
        case 'h':
            return value * 60 * 60;
        case 'd':
            return value * 60 * 60 * 24;
        default:
            throw new Error('Invalid expiration format. Use (s) for seconds, (m) for minutes, (h) for hours, or (d) for days.');
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide both username and password' });
    }

    let user = await User.findOne({ username });

    if (user) {
        return res.status(409).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
        username,
        password: hashedPassword
    });

    if (!user) {
        return res.status(500).json({ error: 'Failed to create user' });
    }

    const token = generateToken(user._id);
    res.status(201).json({
        _id: user._id,
        username: user.username,
        token
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide both username and password' });
    }

    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = generateToken(user._id);
    res.status(200).json({
        _id: user._id,
        username: user.username,
        token
    });
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

const deleteUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
});

const getMe = asyncHandler(async (req, res) => {
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({
        message: 'User data retrieved successfully',
        status: 200,
        data: currentUser,
    });
});

export { getAllUsers, loginUser, registerUser, deleteUserById, getMe };
