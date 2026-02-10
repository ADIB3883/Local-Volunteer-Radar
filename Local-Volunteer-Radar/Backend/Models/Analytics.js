const mongoose = require('mongoose');

const monthlyMetricSchema = new mongoose.Schema({
    month: { type: String, required: true },
    value: { type: Number, required: true }
}, { _id: false });

const analyticsSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            'hours_worked',
            'volunteer_enrollment',
            'ngo_enrollment',
            'active_projects'
        ],
        required: true
    },
    yearlyTotal: { type: Number, required: true },
    trendStatement: { type: String, required: true },
    data: { type: [monthlyMetricSchema], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);