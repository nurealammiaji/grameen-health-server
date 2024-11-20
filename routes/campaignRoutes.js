const express = require('express');
const { createCampaign, updateCampaign, getAllCampaigns, deleteCampaign, getSingleCampaign } = require('../controllers/campaignController');
const campaignRoutes = express.Router();

campaignRoutes.post('/campaigns/create', createCampaign);
campaignRoutes.put('/campaigns/update/:id', updateCampaign);
campaignRoutes.get('/campaigns/read', getAllCampaigns);
campaignRoutes.get('/campaigns/read/:id', getSingleCampaign);
campaignRoutes.delete('/campaigns/delete/:id', deleteCampaign);

module.exports = campaignRoutes;
