const express = require('express');
const { updateUser, deleteUser, getAllUsers, getSingleUser, getAllCustomers, getAllMerchants, getAllAdmins } = require('../controllers/userController');
const verifyJWT = require("../middlewares/jwtVerification");
const upload = require('../middlewares/uploadMiddleware');
const userRoutes = express.Router();

userRoutes.put('/users/update/:id', verifyJWT, upload.single('image'), updateUser);
userRoutes.get('/users/read', verifyJWT, getAllUsers);
userRoutes.get('/users/read/:id', verifyJWT, getSingleUser);
userRoutes.get('/users/customers/read', verifyJWT, getAllCustomers);
userRoutes.get('/users/merchants/read', verifyJWT, getAllMerchants);
userRoutes.get('/users/admins/read', verifyJWT, getAllAdmins);
userRoutes.delete('/users/delete/:id', verifyJWT, deleteUser);

module.exports = userRoutes;

