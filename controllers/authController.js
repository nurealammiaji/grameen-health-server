require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const User = require("../models/userModel");
const { uploadFile, deleteFile } = require('../configs/ftpClient'); // FTP functions

const secret = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const { name, email, phone, password, address, dob, gender, role } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);
        let imagePath = null;

        if (req.file) {
            const localPath = req.file.path;
            imagePath = `uploads/${path.basename(localPath)}`;
            await uploadFile(localPath, imagePath);
        }

        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            dob,
            gender,
            role,
            image: imagePath
        });

        await newUser.save();
        res.status(201).send({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid password!' });
        }

        const token = jwt.sign({ email: user.email }, secret, { expiresIn: "2h" });

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
            role: user.role,
            image: user.image
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const userUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, dob, gender, role } = req.body;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.dob = dob || user.dob;
        user.gender = gender || user.gender;
        user.role = role || user.role;

        if (req.file) {
            if (user.image) {
                await deleteFile(user.image);
            }
            const localPath = req.file.path;
            const newImagePath = `uploads/${path.basename(localPath)}`;
            await uploadFile(localPath, newImagePath);
            user.image = newImagePath;
        }

        await user.save();
        res.status(200).send({ message: 'User updated successfully!' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const deleteUserImage = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        if (user.image) {
            await deleteFile(user.image);
            user.image = null;
            await user.save();
        }

        res.status(200).send({ message: 'User image deleted successfully!' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        // Delete associated image from FTP
        if (user.image) {
            await deleteFile(user.image);
        }

        await user.remove();
        res.status(200).send({ message: 'User deleted successfully!' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

module.exports = { register, login, user, userUpdate, deleteUserImage, deleteUser };