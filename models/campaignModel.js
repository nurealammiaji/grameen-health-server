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
    image: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    campaignType: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
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
