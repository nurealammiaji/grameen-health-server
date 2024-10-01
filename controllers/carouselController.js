const Carousel = require('../models/carouselModel');
const fs = require('fs/promises');

// Helper function to delete an image
const deleteImage = async (imagePath) => {
    if (imagePath) {
        try {
            await fs.unlink(imagePath);
            console.log(`Deleted image: ${imagePath}`);
        } catch (err) {
            console.error(`Failed to delete image: ${imagePath}`, err);
        }
    }
};

// Controller function to create a carousel item
const createCarousel = async (req, res) => {
    let image;
    try {
        const { name, description, destination, status } = req.body;
        image = req.file ? req.file.path : null;

        // Create a new carousel item
        const newCarousel = new Carousel({
            name,
            image,
            description,
            destination,
            status
        });

        const savedCarousel = await newCarousel.save();
        res.status(201).json(savedCarousel);
    } catch (error) {
        await deleteImage(image); // Clean up orphaned image
        res.status(500).json({ error: error.message });
    }
};

// Controller function to update a carousel item
const updateCarousel = async (req, res) => {
    let newImage;
    try {
        const { id } = req.params;
        const { name, description, destination, status } = req.body;
        newImage = req.file ? req.file.path : null;

        // Find the carousel item to update
        const carousel = await Carousel.findById(id);
        if (!carousel) {
            return res.status(404).json({ error: 'Carousel item not found' });
        }

        // Remove the old image if a new image is uploaded
        if (newImage) {
            await deleteImage(carousel.image); // Delete old image
        }

        // Update carousel item with provided fields
        const updatedCarousel = await Carousel.findByIdAndUpdate(id, {
            name: name || carousel.name,
            description: description || carousel.description,
            destination: destination || carousel.destination,
            status: status || carousel.status,
            image: newImage || carousel.image
        }, { new: true });

        if (!updatedCarousel) {
            return res.status(404).json({ error: 'Carousel item not found' });
        }

        // Send the updated carousel item
        res.status(200).json(updatedCarousel);
    } catch (error) {
        await deleteImage(newImage); // Clean up orphaned new image
        res.status(500).json({ message: 'Failed to update carousel', error: error.message });
    }
};

// Controller function to get a carousel item by ID
const getCarousel = async (req, res) => {
    try {
        const { id } = req.params;
        const carousel = await Carousel.findById(id);

        if (!carousel) {
            return res.status(404).json({ error: 'Carousel item not found' });
        }

        res.json(carousel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all carousel items
const getAllCarousels = async (req, res) => {
    try {
        const carousels = await Carousel.find();
        res.status(200).json(carousels);
    } catch (error) {
        console.error("Error fetching carousels:", error);
        res.status(500).json({ error: 'Failed to fetch carousel items', details: error.message });
    }
};

// Delete carousel item
const deleteCarousel = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the carousel item
        const carousel = await Carousel.findById(id);
        if (!carousel) {
            return res.status(404).json({ error: 'Carousel item not found' });
        }

        // Remove the image file from the server if it exists
        await deleteImage(carousel.image);

        // Delete the carousel item from the database
        await Carousel.findByIdAndDelete(id);

        res.status(200).json({ message: 'Carousel item deleted successfully' });
    } catch (error) {
        console.error("Error during carousel deletion:", error);
        res.status(500).json({ error: 'Failed to delete carousel item', details: error.message });
    }
};

module.exports = { createCarousel, getCarousel, getAllCarousels, updateCarousel, deleteCarousel };