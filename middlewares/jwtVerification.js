require("dotenv").config();
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {

    const authorization = req.headers.authorization;
    let token;

    if (!authorization) {
        await res.status(500).send({ message: 'Invalid authorization' });
    }

    if (authorization) {
        token = authorization.split(" ")[1];
        console.log(token);
    }

    if (!token) {
        return await res.status(403).send({ message: 'No token provided!' });
    }

    jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
            return await res.status(401).send({ message: 'Unauthorized!' });
        }

        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;
