const Category = require('../models/categoryModel');
const fs = require('fs/promises');

// Helper function to delete associated images (if any)
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

// Create a new category
const createCategory = async (req, res) => {
    let image;
    try {
        const { type, name, description, status } = req.body;
        image = req.file ? req.file.path : null;

        const newCategory = new Category({
            type,
            name,
            description,
            status,
            image,
        });

        console.log({ newCategory });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        // Delete the uploaded image if category creation fails
        if (image) {
            await deleteImage(image);
        }
        console.error('Failed to create category:', error);
        res.status(500).json({ message: 'Failed to create category', error: error.message });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    const { id } = req.params;
    let newImage;

    try {
        const { type, name, description, status } = req.body;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        newImage = req.file ? req.file.path : null;

        // Update category item, store the old image path for deletion if needed
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                type: type || category.type,
                name: name || category.name,
                description: description || category.description,
                status: status !== undefined ? status : category.status,
                image: newImage || category.image,
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Delete the old image if a new image is uploaded
        if (newImage && category.image) {
            await deleteImage(category.image);
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        // Delete the newly uploaded image if update fails
        if (newImage) {
            await deleteImage(newImage);
        }
        console.error('Failed to update category:', error);
        res.status(500).json({ message: 'Failed to update category', error: error.message });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
};

// Get a single category by ID
const getSingleCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Failed to fetch category:', error);
        res.status(500).json({ message: 'Failed to fetch category', error: error.message });
    }
};

// Delete a category
const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Remove the image file from the server if it exists
        await deleteImage(category.image);

        // Delete the category from the database
        await Category.findByIdAndDelete(id);

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Failed to delete category:', error);
        res.status(500).json({ message: 'Failed to delete category', error: error.message });
    }
};

// Delete multiple categories
const deleteCategories = async (req, res) => {
    const { categoryIds } = req.body;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.status(400).json({ error: 'No IDs provided or invalid format' });
    }

    try {
        // Find all carousel items by the provided IDs
        const categories = await Category.find({ _id: { $in: categoryIds } });

        if (categories.length === 0) {
            return res.status(404).json({ error: 'No Categories items found for the provided IDs' });
        }

        // Remove image files from the server
        const deleteImagePromises = categories.map(category => deleteImage(category.image));
        await Promise.all(deleteImagePromises);

        // Delete the carousel items from the database
        await Category.deleteMany({ _id: { $in: categoryIds } });

        res.status(200).json({ message: 'Category items deleted successfully' });
    } catch (error) {
        console.error("Error during category deletion:", error);
        res.status(500).json({ error: 'Failed to delete carousel items', details: error.message });
    }
};

module.exports = { createCategory, updateCategory, getAllCategories, getSingleCategory, deleteCategory, deleteCategories };
