const express = require("express");
const mainRoutes = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");

mainRoutes.use(authRoutes);
mainRoutes.use(userRoutes);


module.exports = mainRoutes;