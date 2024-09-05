const express = require('express');
const {
    uploadImage,
    updateUser,
    deleteUser,
    updateImage,
    deleteImage,
    getUser
} = require('../controllers/userController');
const verifyJWT = require("../middlewares/jwtVerification");
const upload = require('../middlewares/uploadMiddleware');
const userRoutes = express.Router();

// User Image Routes
userRoutes.post('/upload-image', verifyJWT, upload.single('image'), uploadImage);
userRoutes.put('/update-image', verifyJWT, upload.single('image'), updateImage);
userRoutes.delete('/delete-image', verifyJWT, deleteImage);
// User Routes
userRoutes.get("/:id", verifyJWT, getUser);
userRoutes.put('/update-user', verifyJWT, updateUser);
userRoutes.delete('/delete-user', verifyJWT, deleteUser);

module.exports = userRoutes;

