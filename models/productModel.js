const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema({
    variantName: {
        type: String,
        required: true
    },
    variantColor: {
        type: String,
        required: true
    },
    variantPrice: {
        type: Number,
        required: true
    },
    variantImage: {
        type: String,
    },
});

const productSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number, required: true
    },
    sourcingPrice: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }, // URL for product image
    variants: [productVariantSchema], // Array of product variants
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
