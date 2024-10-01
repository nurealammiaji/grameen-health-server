const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    type: {
        type: String,
        default: "category"
    },
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        default: null,
    },
    status: {
        type: String,
        default: 'pending',
    },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
