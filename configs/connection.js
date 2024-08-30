require("dotenv").config();
const mongoose = require("mongoose");

const db_uri = process.env.DB_URI;

async function main() {
    try {
        await mongoose.connect(db_uri);
        console.log("Database Connected Successfully ...");
    } catch (err) {
        console.error("Database Connection Failed", err);
        process.exit(1); // Exit the app if the database connection fails
    }
}

main();
