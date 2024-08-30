require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const secret = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const { name, email, phone, password, address, dob, gender, role } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);

        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            dob,
            gender,
            role
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
        console.log(email, password);

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

        console.log(id);
        const user = await User.findById(id);

        console.log(user);

        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        res.status(200).send({
            id: user._id,
            email: user.email,
            name: user.name,
            address: user.address,
            phone: user.phone,
            dob: user.dob,
            gender: user.gender,
            role: user.role
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

module.exports = { register, login, user };