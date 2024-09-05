const User = require('../models/userModel');
const path = require("path");

const uploadImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.image = `/uploads/images/${req.file.filename}`;
        await user.save();

        res.json({ message: 'Image uploaded successfully', image: user.image });
    } catch (error) {
        res.status(500).json({ error: 'Image upload failed' });
    }
};

const updateImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove old image if it exists
        if (user.image) {
            const oldImagePath = path.join(__dirname, '..', user.image);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error('Failed to delete old image:', err);
            });
        }

        // Update with the new image
        user.image = `/uploads/images/${req.file.filename}`;
        await user.save();

        res.json({ message: 'Image updated successfully', image: user.image });
    } catch (error) {
        res.status(500).json({ error: 'Image update failed' });
    }
};

const deleteImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove image if it exists
        if (user.image) {
            const imagePath = path.join(__dirname, '..', user.image);
            fs.unlink(imagePath, (err) => {
                if (err) return res.status(500).json({ error: 'Failed to delete image' });
            });

            user.image = null;
            await user.save();
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(400).json({ error: 'No image to delete' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Image delete failed' });
    }
};

const getUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user info' });
    }
};

const updateUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'User update failed' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.remove();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'User delete failed' });
    }
};

module.exports = { uploadImage, updateImage, deleteImage, getUser, updateUser, deleteUser };