const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const mongoose = require('mongoose');

const getPast12Months = () => {
    const months = [];
    const date = new Date();
    for (let i = 11; i >= 0; i--) {
        const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
        months.push({ month: d.toLocaleString('default', { month: 'short' }), year: d.getFullYear() });
    }
    return months;
};

const calculateTrend = (currentTotal, previousTotal) => {
    if (previousTotal === 0) return 'N/A';
    const change = ((currentTotal - previousTotal) / previousTotal) * 100;
    if (change === 0) return 'Unchanged';
    return change > 0 ? `${change.toFixed(0)}% Increase` : `${Math.abs(change).toFixed(0)}% Decrease`;
};

router.get('/', async (req, res) => {
    try {
        const months = getPast12Months();

        const startDate = new Date(months[0].year, new Date(months[0].month + ' 1').getMonth(), 1);
        const endDate = new Date(months[11].year, new Date(months[11].month + ' 1').getMonth() + 1, 0, 23, 59, 59);

        const volunteersData = await User.aggregate([
            { $match: { type: 'volunteer', joinedDate: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: { month: { $month: '$joinedDate' }, year: { $year: '$joinedDate' } },
                    count: { $sum: 1 },
                    hoursWorked: { $sum: '$hoursVolunteered' }
                }
            }
        ]);

        const ngosData = await User.aggregate([
            { $match: { type: 'ngo', joinedDate: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: { month: { $month: '$joinedDate' }, year: { $year: '$joinedDate' } }, count: { $sum: 1 } } }
        ]);

        const activeEventsData = await Event.aggregate([
            {
                $match: {
                    isApproved: true,
                    date: { $gte: startDate.toISOString().split('T')[0], $lte: endDate.toISOString().split('T')[0] }
                }
            },
            {
                $group: {
                    _id: { month: { $month: { $dateFromString: { dateString: '$date' } } }, year: { $year: { $dateFromString: { dateString: '$date' } } } },
                    count: { $sum: 1 }
                }
            }
        ]);

        const fillMonths = (data, field) => {
            return months.map((m, idx) => {
                const match = data.find(d => d._id.month === idx + 1 && d._id.year === m.year);
                return field === 'hoursWorked' ? (match ? match.hoursWorked : 0) : match ? match.count : 0;
            });
        };

        const analytics = {
            hoursWorked: fillMonths(volunteersData, 'hoursWorked'),
            volunteers: fillMonths(volunteersData, 'count'),
            ngos: fillMonths(ngosData, 'count'),
            activeEvents: fillMonths(activeEventsData, 'count')
        };

        const trendStatement = {
            hoursWorked: calculateTrend(analytics.hoursWorked[11], analytics.hoursWorked[10]),
            volunteers: calculateTrend(analytics.volunteers[11], analytics.volunteers[10]),
            ngos: calculateTrend(analytics.ngos[11], analytics.ngos[10]),
            activeEvents: calculateTrend(analytics.activeEvents[11], analytics.activeEvents[10])
        };

        res.json({ analytics, trendStatement, months: months.map(m => m.month) });
    } catch (error) {
        console.error('❌ Analytics error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;