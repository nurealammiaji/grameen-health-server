require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const secret = process.env.JWT_SECRET;

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existUser = await User.findOne({ email });

        if (existUser) {
            return res.status(409).json({ error: 'User already exist' });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ email: user.email }, secret, {
            expiresIn: '1h',
        });

        res.status(201).json({ token, user: { name, email, image: user.image } });
    } catch (error) {
        res.status(400).json({ error: 'User registration failed' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ email: user.email }, secret, {
            expiresIn: '1h',
        });

        // user: { name: user.name, email, image: user.image } 
        res.json(token, user._id);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
};

module.exports = { register, login };
