const Campaign = require('../models/campaignModel');

// Create a new campaign
const createCampaign = async (req, res) => {
    try {
        const { name, description, campaignType, campaignURL, startDate, endDate, discountPercent, status } = req.body;

        const newCampaign = new Campaign({
            name,
            description,
            campaignType,
            campaignURL,
            startDate,
            endDate,
            discountPercent,
            status,
        });

        await newCampaign.save();
        res.status(201).json({ message: 'Campaign created successfully', campaign: newCampaign });
    } catch (error) {
        res.status(500).json({ message: 'Error creating campaign', error: error.message });
    }
};

// Update campaign
const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, campaignType, campaignURL, startDate, endDate, discountPercent, status } = req.body;

        const updatedCampaign = await Campaign.findByIdAndUpdate(id, {
            name,
            description,
            campaignType,
            campaignURL,
            startDate,
            endDate,
            discountPercent,
            status
        }, { new: true });

        if (!updatedCampaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json({ message: 'Campaign updated successfully', campaign: updatedCampaign });
    } catch (error) {
        res.status(500).json({ message: 'Error updating campaign', error: error.message });
    }
};

// Get campaign by ID
const getSingleCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaign', error: error.message });
    }
};

// Get all campaigns
const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
    }
};

// Delete campaign
const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findByIdAndDelete(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting campaign', error: error.message });
    }
};

module.exports = { createCampaign, updateCampaign, getSingleCampaign, getAllCampaigns, deleteCampaign };
