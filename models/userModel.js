const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        default: null
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    address: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: "customer",
    },
    status: {
        type: String,
        default: "active",
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;