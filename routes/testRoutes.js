const express = require("express");
const database = require("../db/database");
const testRoutes = express.Router();

testRoutes.post("/test", (req, res) => {
    const { name, email } = req.body;
    console.log(name, email)
    const query = 'INSERT INTO test (name, email) VALUES (?, ?)';
    database.query(query, [name, email], (err, result) => {
        if (err) throw err;
        res.status(200).send('User added successfully!');
    });
})

testRoutes.get('/test', (req, res) => {
    const query = 'SELECT * FROM test';
    database.query(query, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

module.exports = testRoutes;