const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "review"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    images: [{
        type: String,
    }],
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
    },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
