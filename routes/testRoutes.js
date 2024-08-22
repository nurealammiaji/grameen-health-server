const express = require("express");
const database = require("../db/database");
const testRoutes = express.Router();

testRoutes.post("/test", (req, res) => {
    const { name, email } = req.body;
    console.log(name, email)
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    database.query(query, [name, email], (err, result) => {
        if (err) throw err;
        res.status(200).send('User added successfully!');
    });
})

module.exports = testRoutes;