const express = require("express");
const allRoutes = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");
const shopRoutes = require("./shopRoutes");
const carouselRoutes = require("./carouselRoutes");
const categoryRoutes = require("./categoryRoutes");
const subCategoryRoutes = require("./subCategoryRoutes");
const campaignRoutes = require("./campaignRoutes");
const reviewRoutes = require("./reviewRoutes");
const searchRoutes = require("./searchRoutes");

allRoutes.use(authRoutes);
allRoutes.use(userRoutes);
allRoutes.use(productRoutes);
allRoutes.use(cartRoutes);
allRoutes.use(orderRoutes);
allRoutes.use(shopRoutes);
allRoutes.use(carouselRoutes);
allRoutes.use(categoryRoutes);
allRoutes.use(subCategoryRoutes);
allRoutes.use(campaignRoutes);
allRoutes.use(reviewRoutes);
allRoutes.use(searchRoutes);

module.exports = allRoutes;