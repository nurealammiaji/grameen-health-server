const express = require("express");
const mainRoutes = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const productsRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");

mainRoutes.use(authRoutes);
mainRoutes.use(userRoutes);
mainRoutes.use(productsRoutes);
mainRoutes.use(orderRoutes);

module.exports = mainRoutes;