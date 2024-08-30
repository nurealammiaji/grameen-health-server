const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    additionalPrice: {
        type: Number,
        default: 0
    }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    images: [String], // Array to store paths of multiple images
    variants: [variantSchema], // Array to store product variants
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
