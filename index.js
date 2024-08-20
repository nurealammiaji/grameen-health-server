require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
const mainRoutes = require("./routes/mainRoutes");

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", mainRoutes);

const port = process.env.PORT || 5000;
const server = http.createServer(app);

const database = mysql.createConnection({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
})

database.connect((err) => {
    if (err) {
        console.log("MySQL Error: ", err);
    }
    console.log("MySQL DB Connected Successfully");
})

app.get("/", (req, res) => {
    res.send("Grameen Health Server is running ...");
})

server.listen(port, () => {
    console.log(`Grameen Health Server is running on port: ${port}`);
})