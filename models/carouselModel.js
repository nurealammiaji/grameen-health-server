const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "carousel"
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    destination: {
        type: String,
        default: "/"
    },
    status: {
        type: String,
        default: "active"
    }
}, { timestamps: true });

const Carousel = mongoose.model('Carousel', carouselSchema);

module.exports = Carousel;
