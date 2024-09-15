const fs = require('fs');
const path = require('path');
const User = require('../models/userModel');

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, phone, password } = req.body;
    const profileImage = req.file ? req.file.path : null;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If a new image is uploaded, delete the old one
        if (profileImage && user.image) {
            fs.unlink(user.image, (err) => {
                if (err) console.error("Failed to delete old image", err);
            });
        }

        // Hash new password if provided
        let hashedPassword = user.password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Update user fields
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.password = hashedPassword;
        user.image = profileImage || user.image;

        const updatedUser = await user.save();

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error("Error during user update:", error);
        res.status(500).json({ message: 'Failed to update user', error });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');  // Exclude password
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'Failed to fetch users', error });
    }
};

const getSingleUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select('-password');  // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: 'Failed to fetch user', error });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user image if exists
        if (user.image) {
            fs.unlink(user.image, (err) => {
                if (err) console.error("Failed to delete user image", err);
            });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error during user deletion:", error);
        res.status(500).json({ message: 'Failed to delete user', error });
    }
};

module.exports = { updateUser, getAllUsers, getSingleUser, deleteUser };
