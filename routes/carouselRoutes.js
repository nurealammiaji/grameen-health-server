const express = require('express');
const carouselRoutes = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { createCarousel, updateCarousel, getCarousel, deleteCarousel, getAllCarousels, deleteCarousels } = require('../controllers/carouselController');

carouselRoutes.post('/carousels/create', upload.single('image'), createCarousel);
carouselRoutes.put('/carousels/update/:id', upload.single('image'), updateCarousel);
carouselRoutes.get('/carousels/read/:id', getCarousel);
carouselRoutes.get('/carousels/read', getAllCarousels);
carouselRoutes.delete('/carousels/delete/:id', deleteCarousel);
carouselRoutes.delete('/carousels/delete', deleteCarousels);

module.exports = carouselRoutes;
