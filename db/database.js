require("dotenv").config();
const mysql = require("mysql");

const database = mysql.createConnection({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
})

database.connect((err) => {
    if (err) throw err;
    console.log("MySQL Connected Successfully");
})

module.exports = database;