const express = require("express");
const mainRoutes = express.Router();
const authRoutes = require("./authRoutes");

mainRoutes.use(authRoutes);

module.exports = mainRoutes;