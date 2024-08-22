require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const jwtRoutes = express.Router();

const secret = process.env.JWT_SECRET;

jwtRoutes.post("/jwt", (req, res) => {
    const email = req.body.email;
    console.log(email);
    jwt.sign({email}, secret, {expiresIn: '6h'}, (err, token) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ error: "Error generating token" });
        }
        console.log({token});
        res.status(200).send({token});
    });
});

jwtRoutes.get("/jwt", (req, res) => {
    res.send("This is JWT Route");
});

module.exports = jwtRoutes;