require("dotenv").config();
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const { jwtRoutes } = require("./routes/jwtRoutes");

// Middlewares
app.use(express.json());
app.use(cors());
app.use("/api", jwtRoutes);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Grameen Health Server is running ...");
})

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Grameen Health Server is running on port: ${port}`);
})