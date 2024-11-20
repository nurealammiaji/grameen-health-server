const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "campaign"
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    campaignType: {
        type: String,
        required: true,
    },
    campaignURL: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    discountPercent: {
        type: Number,
        min: 0,
        max: 100,
    },
    status: {
        type: String,
        default: "pending"
    }
}, { timestamps: true });

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
