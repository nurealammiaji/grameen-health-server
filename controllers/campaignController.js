const Campaign = require('../models/campaignModel');
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

// Create a new campaign
const createCampaign = async (req, res) => {
    let image;
    try {
        const { name, description, campaignType, campaignURL, startDate, endDate, discountPercent, status } = req.body;
        image = req.file ? req.file.path : null;

        console.log(req.body);

        const newCampaign = new Campaign({
            name,
            image,
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
        // Delete the uploaded image if category creation fails
        if (image) {
            await deleteImage(image);
        }
        res.status(500).json({ message: 'Error creating campaign', error: error.message });
    }
};

// Update campaign
const updateCampaign = async (req, res) => {
    let newImage;
    try {
        const { id } = req.params;
        const { name, description, campaignType, campaignURL, startDate, endDate, discountPercent, status } = req.body;
        newImage = req.file ? req.file.path : null;

        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const updatedCampaign = await Campaign.findByIdAndUpdate(id, {
            name: name || campaign.name,
            description: description || campaign.description,
            campaignType: campaignType || campaign.campaignType,
            campaignURL: campaignURL || campaign.campaignURL,
            startDate: startDate || campaign.startDate,
            endDate: endDate || campaign.endDate,
            discountPercent: discountPercent || campaign.discountPercent,
            status: status || campaign.status,
        }, { new: true });

        if (!updatedCampaign) {
            return res.status(404).json({ message: 'Campaign is not updated' });
        }

        // Delete the old image if a new image is uploaded
        if (newImage && campaign.image) {
            await deleteImage(campaign.image);
        }

        res.status(200).json({ message: 'Campaign updated successfully', campaign: updatedCampaign });
    } catch (error) {
        if (newImage) {
            await deleteImage(newImage);
        }
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
        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        // Remove the image file from the server if it exists
        await deleteImage(campaign.image);

        // Delete the campaign from the database
        await Campaign.findByIdAndDelete(id);

        res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting campaign', error: error.message });
    }
};

// Delete multiple campaigns
const deleteCampaigns = async (req, res) => {
    const { campaignIds } = req.body;

    if (!Array.isArray(campaignIds) || campaignIds.length === 0) {
        return res.status(400).json({ error: 'No IDs provided or invalid format' });
    }

    try {
        // Find all campaign items by the provided IDs
        const campaigns = await Campaign.find({ _id: { $in: campaignIds } });

        if (campaigns.length === 0) {
            return res.status(404).json({ error: 'No Campaign items found for the provided IDs' });
        }

        // Remove image files from the server
        const deleteImagePromises = campaigns.map(campaign => deleteImage(campaign.image));
        await Promise.all(deleteImagePromises);

        // Delete the carousel items from the database
        await Campaign.deleteMany({ _id: { $in: campaignIds } });

        res.status(200).json({ message: 'Campaign items deleted successfully' });
    } catch (error) {
        console.error("Error during campaign deletion:", error);
        res.status(500).json({ error: 'Failed to delete carousel items', details: error.message });
    }
};

module.exports = { createCampaign, updateCampaign, getSingleCampaign, getAllCampaigns, deleteCampaign, deleteCampaigns };
