const express = require("express");
const mainRoutes = express.Router();
const jwtRoutes = require("./jwtRoutes");

mainRoutes.use(jwtRoutes);

module.exports = mainRoutes;