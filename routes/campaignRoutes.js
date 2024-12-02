const express = require('express');
const { createCampaign, updateCampaign, getAllCampaigns, deleteCampaign, getSingleCampaign, deleteCampaigns } = require('../controllers/campaignController');
const upload = require('../middlewares/uploadMiddleware');
const campaignRoutes = express.Router();

campaignRoutes.post('/campaigns/create', upload.single('image'), createCampaign);
campaignRoutes.put('/campaigns/update/:id', upload.single('image'), updateCampaign);
campaignRoutes.get('/campaigns/read', getAllCampaigns);
campaignRoutes.get('/campaigns/read/:id', getSingleCampaign);
campaignRoutes.delete('/campaigns/delete', deleteCampaigns);
campaignRoutes.delete('/campaigns/delete/:id', deleteCampaign);

module.exports = campaignRoutes;
