const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.status(500).send({message: 'Invalid authorization'});
    }
    const token = authorization.split(" ")[1];
    console.log(token);

    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized!' });
        }

        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;
