const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    description:
    {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    specialPrice: {
        type: Number,
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    model: {
        type: String,
    },
    variants: [
        {
            name: String,
            color: String,
            size: String
        }
    ],
    images: [String], // Array of image file paths
    brand: {
        type: String,
    },
    origin: {
        type: String,
    },
    manufacturer: {
        type: String,
    },
    marketer: {
        type: String,
    },
    status: {
        type: String,
        default: "pending",
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
