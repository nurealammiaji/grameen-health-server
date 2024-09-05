require("dotenv").config();
const connectDB = require("./configs/db");
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const mainRoutes = require("./routes/mainRoutes");
const corsOptions = require("./configs/corsOption");

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/api/v1", mainRoutes);

const port = process.env.PORT || 5000;
const server = http.createServer(app);

connectDB();

app.get("/", (req, res) => {
    res.send("Grameen Health Server is running ...");
})

server.listen(port, () => {
    console.log(`Grameen Health Server is running on port: ${port}`);
})
