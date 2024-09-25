const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "product"
    },
    name: {
        type: String,
        required: true
    },
    description: {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
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
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    needAdvance: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "pending",
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
