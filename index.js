require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const mainRoutes = require("./routes/mainRoutes");
const database = require("./db/database");

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1", mainRoutes);

const port = process.env.PORT || 5000;
const server = http.createServer(app);

app.get("/", (req, res) => {
    res.send("Grameen Health Server is running ...");
})

server.listen(port, () => {
    console.log(`Grameen Health Server is running on port: ${port}`);
})