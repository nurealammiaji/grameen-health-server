const express = require("express");
const mainRoutes = express.Router();
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");

mainRoutes.use(authRoutes);
mainRoutes.use(userRoutes);
mainRoutes.use(productRoutes);

module.exports = mainRoutes;