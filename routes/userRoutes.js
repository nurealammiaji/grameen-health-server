const express = require('express');
const { updateUser, deleteUser, getAllUsers, getSingleUser } = require('../controllers/userController');
const verifyJWT = require("../middlewares/jwtVerification");
const upload = require('../middlewares/uploadMiddleware');
const userRoutes = express.Router();

// User Routes
// userRoutes.get("/users/:id", verifyJWT, getUser);
// userRoutes.put('/users/update', verifyJWT, updateUser);
// userRoutes.delete('/users/delete', verifyJWT, deleteUser);

// Update user with image (based on user ID)
userRoutes.put('/users/update/:id', upload.single('image'), updateUser);

// Delete user (along with image) by ID
userRoutes.delete('/users/delete/:id', deleteUser);

// Get single user by ID
userRoutes.get('/users/:id', getSingleUser);

// Get all users
userRoutes.get('/users', getAllUsers);

module.exports = userRoutes;

