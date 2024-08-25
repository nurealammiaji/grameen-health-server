const express = require("express");
const { register, login, user } = require("../controllers/authController");
const verifyToken = require("../middlewares/jwtVerification");
const authRoutes = express.Router();

authRoutes.post("/auth/register", register);
authRoutes.post("/auth/login", login);
authRoutes.get("/auth/user/:id", verifyToken, user);

module.exports = authRoutes;