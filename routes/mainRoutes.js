const express = require("express");
const mainRoutes = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");
const shopRoutes = require("./shopRoutes");

mainRoutes.use(authRoutes);
mainRoutes.use(userRoutes);
mainRoutes.use(productRoutes);
mainRoutes.use(cartRoutes);
mainRoutes.use(orderRoutes);
mainRoutes.use(shopRoutes);

module.exports = mainRoutes;