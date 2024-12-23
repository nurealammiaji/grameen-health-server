const Payment = require('../models/paymentModel'); // Import the Payment model
const Order = require('../models/orderModel'); // Import the Order model to verify if the order exists

// Create a new payment
const createPayment = async (req, res) => {
    try {
        const { orderId, paymentMethod, amount, transactionId, mobileNumber, mfsProvider, accountNumber, bankName, branch, paymentDetails } = req.body;

        // Check if the order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Create a new payment record
        const newPayment = new Payment({
            orderId,
            paymentMethod,
            amount,
            transactionId,
            mobileNumber,
            mfsProvider,
            accountNumber,
            bankName,
            branch,
            paymentDetails
        });

        // Save the payment record
        await newPayment.save();

        return res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update an existing payment
const updatePayment = async (req, res) => {
    try {
        const { paymentId } = req.params; // Get paymentId from route params
        const { paymentMethod, status, transactionId, amount, mobileNumber, mfsProvider, accountNumber, bankName, branch, paymentDetails } = req.body;

        // Find the payment by ID
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Update payment fields
        payment.paymentMethod = paymentMethod || payment.paymentMethod;
        payment.status = status || payment.status;
        payment.transactionId = transactionId || payment.transactionId;
        payment.amount = amount || payment.amount;
        payment.mobileNumber = mobileNumber || payment.mobileNumber;
        payment.mfsProvider = mfsProvider || payment.mfsProvider;
        payment.accountNumber = accountNumber || payment.accountNumber;
        payment.bankName = bankName || payment.bankName;
        payment.branch = branch || payment.branch;
        payment.paymentDetails = paymentDetails || payment.paymentDetails;

        // Save the updated payment
        await payment.save();

        return res.status(200).json({ message: 'Payment updated successfully', payment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a single payment by ID
const getSinglePayment = async (req, res) => {
    try {
        const { paymentId } = req.params; // Get paymentId from route params

        // Find the payment by ID
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        return res.status(200).json({ payment });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all payments
const getAllPayments = async (req, res) => {
    try {
        // Fetch all payments from the database
        const payments = await Payment.find().populate('orderId'); // You can populate orderId to get the order details

        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: 'No payments found' });
        }

        return res.status(200).json({ payments });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a payment by ID
const deletePayment = async (req, res) => {
    try {
        const { paymentId } = req.params; // Get paymentId from route params

        // Find the payment by ID
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Delete the payment
        await payment.remove();

        return res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { createPayment, updatePayment, getSinglePayment, getAllPayments, deletePayment };