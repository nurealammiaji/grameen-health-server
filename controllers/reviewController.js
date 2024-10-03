const Review = require('../models/reviewModel');
const mongoose = require('mongoose');
const fs = require('fs/promises');

// Helper function to delete files
const deleteFiles = async (files) => {
    return Promise.all(files.map(async (file) => {
        try {
            await fs.unlink(file);
        } catch (err) {
            console.error(`Failed to delete file ${file}: ${err.message}`);
        }
    }));
};

// Create a new product review
const createReview = async (req, res) => {
    const { userId, orderId, productId, rating, comment } = req.body; // Destructure req.body
    let images; // Declare images variable

    // Validate input
    if (!userId || !orderId || !productId || !rating) {
        return res.status(400).json({ message: 'User ID, Order ID, Product ID, and Rating are required.' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        // Assign values to images
        images = req.files ? req.files.map(file => file.path) : [];

        const review = new Review({ userId, orderId, productId, rating, comment, images });
        await review.save();
        res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
        // Delete uploaded images if saving the review fails
        if (images) {
            await deleteFiles(images);
        }
        res.status(500).json({ message: 'Error creating review', error: error.message });
    }
};

// Update an existing product review
const updateReview = async (req, res) => {
    const { id } = req.params;

    // Validate input
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid review ID.' });
    }

    let newImages; // Declare images variable
    const updateData = { ...req.body };

    try {
        // Assign values to images
        newImages = req.files ? req.files.map(file => file.path) : undefined;

        if (newImages) {
            // If there are existing images, delete them before updating
            const existingReview = await Review.findById(id);
            if (existingReview && existingReview.images) {
                await deleteFiles(existingReview.images); // Delete existing images
            }
            updateData.images = newImages; // Update images
        }

        const review = await Review.findByIdAndUpdate(id, updateData, { new: true });
        if (!review) {
            // If the review was not found, delete new images
            if (newImages) {
                await deleteFiles(newImages);
            }
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json({ message: 'Review updated successfully', review });
    } catch (error) {
        // Delete uploaded images if updating the review fails
        if (newImages) {
            await deleteFiles(newImages);
        }
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
};

// Get a single product review
const getSingleReview = async (req, res) => {
    const { id } = req.params;

    // Validate input
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid review ID.' });
    }

    try {
        const review = await Review.findById(id).populate('userId').populate('productId').populate('orderId');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching review', error: error.message });
    }
};

// Get all product reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('userId').populate('productId').populate('orderId');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// Get reviews by product ID
const getReviewsByProductId = async (req, res) => {
    const { productId } = req.params;

    // Validate input
    if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ message: 'Invalid product ID.' });
    }

    try {
        const reviews = await Review.find({ productId }).populate('userId').populate('orderId');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// Get reviews by user ID
const getReviewsByUserId = async (req, res) => {
    const { userId } = req.params;

    // Validate input
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID.' });
    }

    try {
        const reviews = await Review.find({ userId }).populate('productId').populate('orderId');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// Get reviews by order ID
const getReviewsByOrderId = async (req, res) => {
    const { orderId } = req.params;

    // Validate input
    if (!mongoose.isValidObjectId(orderId)) {
        return res.status(400).json({ message: 'Invalid order ID.' });
    }

    try {
        const reviews = await Review.find({ orderId }).populate('userId').populate('productId');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

// Delete a product review
const deleteReview = async (req, res) => {
    const { id } = req.params;

    // Validate input
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid review ID.' });
    }

    try {
        const review = await Review.findByIdAndDelete(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        // Delete associated files
        if (review.images && review.images.length > 0) {
            await deleteFiles(review.images);
        }
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
};

module.exports = { createReview, updateReview, getSingleReview, getAllReviews, getReviewsByProductId, getReviewsByUserId, getReviewsByOrderId, deleteReview, };
