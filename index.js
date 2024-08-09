require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Grameen Health Server is running ...");
})

app.listen(port, () => {
    console.log(`Grameen Health Server is running on port: ${port}`);
})