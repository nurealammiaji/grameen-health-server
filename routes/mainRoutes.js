const express = require("express");
const mainRoutes = express.Router();
const jwtRoutes = require("./jwtRoutes");
const testRoutes = require("./testRoutes");
const authRoutes = require("./authRoutes");

mainRoutes.use(jwtRoutes);
mainRoutes.use(authRoutes);
mainRoutes.use(testRoutes);

module.exports = mainRoutes;