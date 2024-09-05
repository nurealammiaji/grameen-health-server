const express = require('express');
const { register, login } = require('../controllers/authController');
const upload = require('../middlewares/uploadMiddleware');
const authRoutes = express.Router();


authRoutes.post('/auth/register', upload.single('image'), register);
authRoutes.post('/auth/login', login);

module.exports = authRoutes;