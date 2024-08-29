const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/grameenhealth')
        .then((res) => {
            if (res) {
                console.log("Database Connected Successfully");
            }
        })
}