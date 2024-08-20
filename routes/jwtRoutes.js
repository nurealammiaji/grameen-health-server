require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const jwtRoutes = express.Router();

const secret = process.env.JWT_SECRET;

jwtRoutes.post("/jwt", (req, res) => {
    const email = req.body.email;
    const token = jwt.sign(secret, email, {expire: "1d"});
    res.send(token);
})

jwtRoutes.get("/jwt", (req, res) => {
    res.send("This is JWT Route");
})

module.exports = jwtRoutes;