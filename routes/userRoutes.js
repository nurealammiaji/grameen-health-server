const express = require('express');
const { updateUser, deleteUser, getAllUsers, getSingleUser } = require('../controllers/userController');
const verifyJWT = require("../middlewares/jwtVerification");
const upload = require('../middlewares/uploadMiddleware');
const userRoutes = express.Router();

userRoutes.put('/users/update/:id', verifyJWT, upload.single('image'), updateUser);
userRoutes.delete('/users/delete/:id', verifyJWT, deleteUser);
userRoutes.get('/users/:id', verifyJWT, getSingleUser);
userRoutes.get('/users', verifyJWT, getAllUsers);

module.exports = userRoutes;

