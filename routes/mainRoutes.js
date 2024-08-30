const express = require("express");
const mainRoutes = express.Router();
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");

mainRoutes.use(authRoutes);
mainRoutes.use(productRoutes);

module.exports = mainRoutes;