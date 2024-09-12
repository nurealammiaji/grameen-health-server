require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const secret = process.env.JWT_SECRET;

const register = async (req, res) => {
    const { name, phone, password } = req.body;
    console.log({name, phone, password});

    try {
        // Check if user already exists
        let existingUser = await User.findOne({ phone });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user object
        const newUser = new User({
            name,
            phone,
            password: hashedPassword,
            image: req.file ? `/uploads/images/users/${req.file.filename}` : null, // Store image path
        });

        // Save user to DB
        const user = await newUser.save();

        const token = jwt.sign({ phone: phone }, secret, {
            expiresIn: "2h",
        });

        res.status(201).json({ message: 'User registered successfully', user: user, id: user._id, accessToken: token });
    } catch (error) {
        res.status(500).json({ error: 'User registration failed' });
    }
};

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        console.log({phone, password});

        const user = await User.findOne({ phone: phone });
        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid password!' });
        }

        const token = jwt.sign({ phone: user.phone }, secret, {
            expiresIn: "2h",
        });

        res.status(200).send({
            id: user._id,
            accessToken: token,
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

module.exports = { register, login };
