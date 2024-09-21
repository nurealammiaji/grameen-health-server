const Carousel = require('../models/carouselModel');
const path = require('path');
const fs = require('fs/promises');

// Controller function to create a carousel item
const createCarousel = async (req, res) => {
    let image;
    try {
        const { title, description, destination, status } = req.body;
        image = req.file ? req.file.path : null;

        // Create a new carousel item
        const newCarousel = new Carousel({
            title,
            image,
            description,
            destination,
            status
        });

        const savedCarousel = await newCarousel.save();
        res.status(201).json(savedCarousel);
    } catch (error) {
        if (image) {
            try {
                await fs.unlink(image);
                console.error(`Deleted orphaned image successfully: ${err.message}`);
            } catch (err) {
                console.error(`Failed to delete orphaned image: ${err.message}`);
            }
        }
        res.status(500).json({ error: error.message });
    }
};

// Controller function to update a carousel item
const updateCarousel = async (req, res) => {
    let newImage;
    try {
        const { id } = req.params;
        const { title, description, destination, status } = req.body;
        newImage = req.file ? req.file.path : null; // Get new image path if available
        // Find the carousel item to update
        const carousel = await Carousel.findById(id);
        if (!carousel) {
            return res.status(404).json({ error: 'Carousel item not found' });
        }

        // Remove the old image if a new image is uploaded
        if (newImage && carousel.image) {
            try {
                await fs.unlink(carousel.image);
                console.log(`Deleted old image: ${carousel.image}`);
            } catch (err) {
                console.error(`Failed to delete old image: ${carousel.image}`, err);
            }
        }

        // Update carousel item with provided fields
        const updatedCarousel = await Carousel.findByIdAndUpdate(id, {
            title: title || carousel.title,
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
        if (newImage) {
            try {
                await fs.unlink(newImage);
                console.error(`Deleted orphaned image successfully: ${err.message}`);
            } catch (err) {
                console.error(`Failed to delete orphaned image: ${err.message}`);
            }
        }
        console.error("Error updating carousel:", error);
        res.status(500).json({ message: 'Failed to update carousel', error });
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

const getAllCarousels = async (req, res) => {
    try {
        const carousels = await Carousel.find();
        res.status(200).json(carousels);
    } catch (error) {
        console.error("Error fetching carousels:", error);
        res.status(500).json({ error: 'Failed to fetch carousel items', details: error.message });
    }
};

const deleteCarousel = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the carousel item
        const carousel = await Carousel.findById(id);
        if (!carousel) {
            return res.status(404).json({ error: 'Carousel item not found' });
        }

        // Remove the image file from the server if it exists
        if (carousel.image) {
            try {
                await fs.unlink(carousel.image);
                console.log(`Deleted carousel image: ${carousel.image}`);
            } catch (err) {
                console.error(`Failed to delete carousel image: ${carousel.image}`, err);
            }
        }

        // Delete the carousel item from the database
        await Carousel.findByIdAndDelete(id);

        res.status(200).json({ message: 'Carousel item deleted successfully' });
    } catch (error) {
        console.error("Error during carousel deletion:", error);
        res.status(500).json({ error: 'Failed to delete carousel item', details: error.message });
    }
};

module.exports = { createCarousel, getCarousel, getAllCarousels, updateCarousel, deleteCarousel };

