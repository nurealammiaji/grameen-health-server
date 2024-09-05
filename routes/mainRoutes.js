const express = require("express");
const mainRoutes = express.Router();
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");
const path = require("path");

mainRoutes.use("/uploads", express.static(path.join(__dirname, 'uploads')));
mainRoutes.use("/auth", authRoutes);
mainRoutes.use("/users", userRoutes);
mainRoutes.use(productRoutes);

module.exports = mainRoutes;