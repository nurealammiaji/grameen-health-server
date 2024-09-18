const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const secret = process.env.JWT_SECRET;

const verifyUser = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        if (!accessToken) {
            return res.status(403).send({ message: "No token provided!" });
        }

        const decoded = jwt.verify(accessToken, secret);
        req.userId = decoded.id;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }

        if (!user.role === "user") {
            return res.status(403).send({ message: "Require User Role!" });
        }

        next();
    } catch (error) {
        return res.status(401).send({ message: "Unauthorized!" });
    }
};

module.exports = verifyUser;
