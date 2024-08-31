const express = require('express');
const multer = require('multer');
const path = require('path');
const verifyJWT = require("../middlewares/jwtVerification");
const {
    register,
    login,
    user,
    userUpdate,
    deleteUserImage,
    deleteUser
} = require('../controllers/authController');

const authRoutes = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'temp/'); // Use a temporary directory for storing files before FTP upload
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

// Define routes
authRoutes.post('/auth/register', upload.single('image'), register); // Register a new user with image upload
authRoutes.post('/auth/login', login); // User login
authRoutes.get('/auth/user/:id', verifyJWT, user); // Get user by ID
authRoutes.put('/auth/user/:id', verifyJWT, upload.single('image'), userUpdate); // Update user by ID with optional image upload
authRoutes.delete('/auth/user/:id/image', verifyJWT, deleteUserImage); // Delete user image by ID
authRoutes.delete('/auth/user/:id', verifyJWT, deleteUser); // Delete user by ID

module.exports = authRoutes;