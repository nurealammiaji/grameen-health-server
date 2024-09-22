const express = require("express");
const mainRoutes = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");
const shopRoutes = require("./shopRoutes");
const carouselRoutes = require("./carouselRoutes");
const categoryRoutes = require("./categoryRoutes");
const subCategoryRoutes = require("./subCategoryRoutes");
const searchRoutes = require("./searchRoutes");

mainRoutes.use(authRoutes);
mainRoutes.use(userRoutes);
mainRoutes.use(productRoutes);
mainRoutes.use(cartRoutes);
mainRoutes.use(orderRoutes);
mainRoutes.use(shopRoutes);
mainRoutes.use(carouselRoutes);
mainRoutes.use(categoryRoutes);
mainRoutes.use(subCategoryRoutes);
mainRoutes.use(searchRoutes);

module.exports = mainRoutes;