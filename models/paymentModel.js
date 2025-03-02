const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['MFS', 'bank', 'COD'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        required: function () {
            return this.paymentMethod !== 'COD';
        }
    },
    amount: {
        type: Number,
        required: true
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
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentDetails: {
        type: String, // You could store additional details, like payment reference number or comments
        default: ''
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
