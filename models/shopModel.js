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
    description: {
        type: String,
        required: true
    },
    shopLogo: {
        type: String,
    },
    shopBanners: [{
        type: String
    }],
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: "pending"
    }
}, { timestamps: true });

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
