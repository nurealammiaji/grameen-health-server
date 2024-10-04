const fs = require('fs/promises');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = require('../models/userModel');

const updateUser = async (req, res) => {
    let profileImage;
    try {
        const { id } = req.params;
        const { name, phone, password } = req.body;
        profileImage = req.file ? req.file.path : null;
        // Find the existing user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete old profile image if a new one is uploaded
        if (profileImage && user.image) {
            try {
                await fs.unlink(user.image);
                console.log(`Old image deleted: ${user.image}`);
            } catch (err) {
                console.error(`Failed to delete old image: ${user.image}`, err);
            }
        }

        // Hash new password if provided
        let hashedPassword = user.password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Update user fields
        const updatedUser = await User.findByIdAndUpdate(id, {
            name: name || user.name,
            phone: phone || user.phone,
            password: password ? hashedPassword : user.password,
            image: profileImage || user.image
        }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        if (profileImage) {
            try {
                await fs.unlink(profileImage);
                console.error(`Deleted orphaned image successfully: ${err.message}`);
            } catch (err) {
                console.error(`Failed to delete orphaned image: ${err.message}`);
            }
        }
        console.error("Error during user update:", error);
        res.status(500).json({ message: 'Failed to update user', error });
    }
};

const getSingleUser = async (req, res) => {
    const { id } = req.params;
    console.log(id);

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

const getAllMerchants = async (req, res) => {
    try {
        const merchants = await User.find({ role: 'merchant' }).select('-password');  // Exclude password
        res.status(200).json(merchants);
    } catch (error) {
        console.error("Error fetching merchants:", error);
        res.status(500).json({ message: 'Failed to fetch merchants', error });
    }
};

const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' }).select('-password');  // Exclude password
        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ message: 'Failed to fetch customers', error });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password');  // Exclude password
        res.status(200).json(admins);
    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({ message: 'Failed to fetch admins', error });
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

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the user to delete
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user's image if it exists
        if (user.image) {
            try {
                await fs.unlink(user.image);
                console.log(`Deleted user image: ${user.image}`);
            } catch (err) {
                console.error(`Failed to delete user image: ${user.image}`, err);
            }
        }

        // Delete the user from the database
        await User.findByIdAndDelete(id);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error during user deletion:", error);
        res.status(500).json({ message: 'Failed to delete user', error });
    }
};

module.exports = { updateUser, getAllUsers, getSingleUser, getAllCustomers, getAllMerchants, getAllAdmins, deleteUser };
