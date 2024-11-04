const SubCategory = require('../models/subCategoryModel'); // Adjust path as needed
const Category = require('../models/categoryModel'); // Adjust path as needed
const fs = require('fs/promises');

// Helper function to delete image files
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

// Create a new subcategory
const createSubCategory = async (req, res) => {
    let image;
    try {
        const { name, description, category, status } = req.body;
        image = req.file ? req.file.path : null;

        // Validate the category
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const newSubCategory = new SubCategory({
            name,
            description,
            category,
            status,
            image,
        });

        const savedSubCategory = await newSubCategory.save();
        res.status(201).json(savedSubCategory);
    } catch (error) {
        if (image) {
            await deleteImage(image);
        }
        console.error('Failed to create subcategory:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update an existing subcategory
const updateSubCategory = async (req, res) => {
    let newImage;
    try {
        const { id } = req.params;
        const { name, description, category, status } = req.body;
        newImage = req.file ? req.file.path : null;

        const subCategory = await SubCategory.findById(id);
        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        // Validate the category if provided
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({ message: 'Category not found' });
            }
        }

        // Remove old image if a new image is uploaded
        if (newImage && subCategory.image) {
            await deleteImage(subCategory.image);
        }

        // Update subcategory
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, {
            name: name || subCategory.name,
            description: description || subCategory.description,
            category: category || subCategory.category,
            status: status || subCategory.status,
            image: newImage || subCategory.image,
        }, { new: true });

        if (!updatedSubCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.status(200).json(updatedSubCategory);
    } catch (error) {
        if (newImage) {
            await deleteImage(newImage);
        }
        console.error('Failed to update subcategory:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all subcategories
const getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find().populate('category');
        res.status(200).json(subCategories);
    } catch (error) {
        console.error('Failed to fetch subcategories:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all subcategories by category ID
const getSubCategoriesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Find subcategories for the specified category
        const subCategories = await SubCategory.find({ category: categoryId }).populate('category');

        if (!subCategories.length) {
            return res.status(404).json({ message: 'No subcategories found for this category' });
        }

        res.status(200).json(subCategories);
    } catch (error) {
        console.error('Failed to fetch subcategories by category:', error);
        res.status(500).json({ error: error.message });
    }
};


// Get a single subcategory by ID
const getSingleSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const subCategory = await SubCategory.findById(id).populate('category');

        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.status(200).json(subCategory);
    } catch (error) {
        console.error('Failed to fetch subcategory:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete a subcategory
const deleteSubCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const subCategory = await SubCategory.findById(id);
        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        // Delete image if it exists
        await deleteImage(subCategory.image);

        // Delete the subcategory from the database
        await SubCategory.findByIdAndDelete(id);

        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        console.error('Failed to delete subcategory:', error);
        res.status(500).json({ error: error.message });
    }
};

// Delete multiple sub categories
const deleteSubCategories = async (req, res) => {
    const { subCategoryIds } = req.body;

    if (!Array.isArray(subCategoryIds) || subCategoryIds.length === 0) {
        return res.status(400).json({ error: 'No IDs provided or invalid format' });
    }

    try {
        // Find all carousel items by the provided IDs
        const subCategories = await SubCategory.find({ _id: { $in: subCategoryIds } });

        if (subCategories.length === 0) {
            return res.status(404).json({ error: 'No Sub Categories items found for the provided IDs' });
        }

        // Remove image files from the server
        const deleteImagePromises = subCategories.map(subCategory => deleteImage(subCategory.image));
        await Promise.all(deleteImagePromises);

        // Delete the carousel items from the database
        await SubCategory.deleteMany({ _id: { $in: subCategoryIds } });

        res.status(200).json({ message: 'Sub Category items deleted successfully' });
    } catch (error) {
        console.error("Error during sub category deletion:", error);
        res.status(500).json({ error: 'Failed to delete carousel items', details: error.message });
    }
};

module.exports = { createSubCategory, updateSubCategory, getAllSubCategories, getSubCategoriesByCategory, getSingleSubCategory, deleteSubCategory, deleteSubCategories };
