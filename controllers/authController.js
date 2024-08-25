require("dotenv").config();
const database = require("../configs/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const register = (req, res) => {
    const { full_name, username, email, phone, password, address, date_of_birth } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    database.query(
        'INSERT INTO users (full_name, username, email, phone, password, address, date_of_birth) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [full_name, username, email, phone, hashedPassword, address, date_of_birth],
        (err, results) => {
            if (err) {
                return res.status(500).send({ message: err.message });
            }
            res.status(201).send({ message: 'User registered successfully!' });
        }
    );
};

const login = (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    database.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).send({ message: err.message });

        if (!results.length) {
            return res.status(404).send({ message: 'User not found!' });
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid password!' });
        }

        const token = jwt.sign({ email: user.email }, secret, {
            expiresIn: "2h",
        });

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken: token,
        });
    });
};

const user = (req, res) => {
    const { id } = req.params;
    console.log(id);

    database.query('SELECT * FROM users WHERE id =?', [id], (err, results) => {
        if (err) return res.status(500).send({ message: err.message });

        if (!results.length) {
            return res.status(404).send({ message: 'User not found!' });
        }

        const user = results[0];

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            address: user.address,
            phone: user.phone,
            date_of_birth: user.date_of_birth
        });
    });
}

module.exports = {register, login, user};
