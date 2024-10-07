require("dotenv").config();
const connectDB = require("./configs/db");
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const corsOptions = require("./configs/corsOption");
const allRoutes = require("./routes/allRoutes");
const path = require('path');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Routes
app.use("/api/v1", allRoutes);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = process.env.PORT || 5000;
const server = http.createServer(app);

connectDB();

app.get("/", (req, res) => {
    res.send("Grameen Health Server is running ...");
})

server.listen(port, () => {
    console.log(`Grameen Health Server is running on port: ${port}`);
})
