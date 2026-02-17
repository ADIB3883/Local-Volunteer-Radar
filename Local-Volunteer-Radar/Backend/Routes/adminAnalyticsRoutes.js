const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Volunteer = require('../Models/Volunteer');
const Organizer = require('../Models/Organizer');
const Event = require('../Models/Event');
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
    if (!previousTotal || previousTotal === 0) {
        if (!currentTotal || currentTotal === 0) return 'No change';
        return 'Unavailable';
    }

    const change = ((currentTotal - previousTotal) / previousTotal) * 100;
    if (change === 0) return 'No change';
    return change > 0 ? `${change.toFixed(0)}% Increase` : `${Math.abs(change).toFixed(0)}% Decrease`;
};

router.get('/', async (req, res) => {
    try {
        const months = getPast12Months();

        const startDate = new Date(months[0].year, new Date(months[0].month + ' 1').getMonth(), 1);
        const endDate = new Date(months[11].year, new Date(months[11].month + ' 1').getMonth() + 1, 0, 23, 59, 59);

        const volunteersData = await Volunteer.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
                    count: { $sum: 1 }
                }
            }
        ]);

        const organizerData = await Organizer.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } }
        ]);

        const activeEventsData = await Event.aggregate([
            { $addFields: { eventDate: { $dateFromString: { dateString: '$startdate' } } } },
            { $match: { isApproved: true, eventDate: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: { month: { $month: '$eventDate' }, year: { $year: '$eventDate' } },
                    count: { $sum: 1 },
                    volunteersRegistered: { $sum: { $ifNull: ['$volunteersRegistered', 0] } }
                }
            }
        ]);

        const fillMonths = (data, field) => {
            return months.map((m, idx) => {
                const match = data.find(d => d._id.month === idx + 1 && d._id.year === m.year);
                if (!match) return 0;
                if (field === 'hoursWorked') return match.volunteersRegistered || 0;
                return match.count || 0;
            });
        };

        const analytics = {
            hoursWorked: fillMonths(activeEventsData, 'hoursWorked'),
            volunteers: fillMonths(volunteersData, 'count'),
            organizer: fillMonths(organizerData, 'count'),
            activeEvents: fillMonths(activeEventsData, 'count')
        };

        const trendStatement = {
            hoursWorked: calculateTrend(analytics.hoursWorked[11], analytics.hoursWorked[10]),
            volunteers: calculateTrend(analytics.volunteers[11], analytics.volunteers[10]),
            organizer: calculateTrend(analytics.organizer[11], analytics.organizer[10]),
            activeEvents: calculateTrend(analytics.activeEvents[11], analytics.activeEvents[10])
        };

        res.json({ analytics, trendStatement, months: months.map(m => m.month) });
    } catch (error) {
        console.error('❌ Analytics error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;