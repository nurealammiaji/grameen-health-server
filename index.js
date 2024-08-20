require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const mainRoutes = require("./routes/mainRoutes");

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", mainRoutes);

app.get("/", (req, res) => {
    res.send("Grameen Health Server is running ...");
})

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Grameen Health Server is running on port: ${port}`);
})