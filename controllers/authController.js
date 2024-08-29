require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const secret = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const { fullName, username, email, phone, password, address, dob } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);

        const newUser = new User({
            fullName,
            username,
            email,
            phone,
            password: hashedPassword,
            address,
            dob
        });

        console.log(newUser);

        await newUser.save();
        res.status(201).send({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid password!' });
        }

        const token = jwt.sign({ email: user.email }, secret, {
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

const user = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        console.log(user);
        
        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            address: user.address,
            phone: user.phone,
            dob: user.dob
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

module.exports = { register, login, user };