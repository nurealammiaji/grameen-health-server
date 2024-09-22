const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    type: {
        type: String,
        default: "subCategory"
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    subCategoryURL: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    image: {
        type: String, // Path to the image file
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    status: {
        type: String,
        default: "pending",
    },
}, { timestamps: true });

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
