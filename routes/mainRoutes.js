const express = require("express");
const mainRoutes = express.Router();
const jwtRoutes = require("./jwtRoutes");
const testRoutes = require("./testRoutes");

mainRoutes.use(jwtRoutes);
mainRoutes.use(testRoutes);

module.exports = mainRoutes;