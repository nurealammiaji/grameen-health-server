const express = require("express");
const mainRoutes = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const productsRoutes = require("./productRoutes");

mainRoutes.use(authRoutes);
mainRoutes.use(userRoutes);
mainRoutes.use(productsRoutes);

module.exports = mainRoutes;