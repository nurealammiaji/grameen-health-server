const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "product"
    },
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
        default: null
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
        default: null
    },
    variants: {
        type: Array,
        default: null
    },
    images: {
        type: Array,
    },
    brand: {
        type: String,
        default: null
    },
    originCountry: {
        type: String,
        default: null
    },
    manufacturer: {
        type: String,
        default: null
    },
    // importer: {
    //     type: String,
    //     default: null
    // },
    // distributor: {
    //     type: String,
    //     default: null
    // },
    // marketer: {
    //     type: String,
    //     default: "Grameen Health"
    // },
    status: {
        type: String,
        default: "pending",
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
