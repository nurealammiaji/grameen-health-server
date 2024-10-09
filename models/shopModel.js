const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "shop"
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shopLogo: {
        type: String,
        required: true
    },
    shopBanners: [{
        type: String,
        required: true
    }],
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        default: "pending"
    }
}, { timestamps: true });

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
