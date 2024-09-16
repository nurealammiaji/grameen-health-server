const express = require('express');
const carouselRoutes = express.Router();
const upload = require('../middlewares/uploadMiddleware');
// Import the controller functions
const {
    createCarousel,
    updateCarousel,
    getCarousel,
    deleteCarousel
} = require('../controllers/carouselController');


carouselRoutes.post('/carousel', upload.single('image'), createCarousel);
carouselRoutes.put('/carousel/update/:id', upload.single('image'), updateCarousel);
carouselRoutes.get('/carousel/:id', getCarousel);
carouselRoutes.delete('/carousel/delete/:id', deleteCarousel);

module.exports = carouselRoutes;
