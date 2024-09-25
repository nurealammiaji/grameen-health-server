const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "order"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    shippingCharge: {
        type: Number,
        required: true
    },
    additionalShippingFee: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: "pending"
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['MFS', 'bank', 'cash_on_delivery'],
        required: true
    },
    paymentInfo: {
        transactionId: {
            type: String,
            required: function () {
                return this.paymentMethod !== 'cash_on_delivery';
            }
        },
        amount: {
            type: Number,
            required: function () {
                return this.paymentMethod !== 'cash_on_delivery';
            }
        },
        mobileNumber: {
            type: String,
            required: function () {
                return this.paymentMethod === 'MFS';
            }
        },
        mfsProvider: {
            type: String,
            enum: ['bKash', 'Nagad', 'Upay'],
            required: function () {
                return this.paymentMethod === 'MFS';
            }
        },
        accountNumber: {
            type: String,
            required: function () {
                return this.paymentMethod === 'bank';
            }
        },
        bankName: {
            type: String,
            required: function () {
                return this.paymentMethod === 'bank';
            }
        },
        branch: {
            type: String,
            required: function () {
                return this.paymentMethod === 'bank';
            }
        }
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
