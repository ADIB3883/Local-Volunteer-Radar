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

// GET /api/admin/users/volunteers - Get all approved volunteers
router.get('/users/volunteers', async (req, res) => {
    try {
        const volunteers = await User.find({ type: 'volunteer', isApproved: true }).select('name email type joinedDate isApproved hoursVolunteered');
        res.json({ users: volunteers });
    } catch (error) {
        console.error('❌ Error fetching volunteers:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/admin/users/organizers - Get all approved organizers
router.get('/users/organizers', async (req, res) => {
    try {
        const organizers = await User.find({ type: 'organizer', isApproved: true }).select('name email type joinedDate isApproved');
        res.json({ users: organizers });
    } catch (error) {
        console.error('❌ Error fetching organizers:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/admin/events/active - Get active events
router.get('/events/active', async (req, res) => {
    try {
        const activeEvents = await Event.find({ isPending: false, isApproved: true });
        res.json({ events: activeEvents });
    } catch (error) {
        console.error('❌ Error fetching active events:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/admin/counts - Get stats counts
router.get('/counts', async (req, res) => {
    try {
        const totalVolunteers = await User.countDocuments({ type: 'volunteer' });
        const totalOrganizers = await User.countDocuments({ type: 'organizer' });
        const activeEvents = await Event.countDocuments({ isPending: false, isApproved: true });
        
        res.json({ 
            totalVolunteers,
            totalOrganizers,
            activeEvents
        });
    } catch (error) {
        console.error('❌ Error fetching counts:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;