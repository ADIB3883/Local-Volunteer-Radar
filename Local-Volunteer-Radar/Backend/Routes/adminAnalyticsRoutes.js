const express = require('express');
const router = express.Router();
const Volunteer = require('../Models/Volunteer');
const Organizer = require('../Models/Organizer');
const Event = require('../Models/Event');

// Returns the past 12 months as { month (short name), monthNum (1-12), year }
const getPast12Months = () => {
    const months = [];
    const date = new Date();
    for (let i = 11; i >= 0; i--) {
        const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
        months.push({
            month: d.toLocaleString('default', { month: 'short' }),
            monthNum: d.getMonth() + 1,
            year: d.getFullYear()
        });
    }
    return months;
};

// YoY: compares current 12-month window total vs previous 12-month window total
const calculateYoYTrend = (currentTotal, previousTotal) => {
    if (!previousTotal || previousTotal === 0) {
        if (!currentTotal || currentTotal === 0) return 'No change';
        return 'Unavailable';
    }
    if (currentTotal === previousTotal) return 'No change';
    const change = ((currentTotal - previousTotal) / previousTotal) * 100;
    const rounded = Math.round(change);
    return rounded > 0
        ? `${rounded}% Increase`
        : `${Math.abs(rounded)}% Decrease`;
};

router.get('/', async (req, res) => {
    try {
        const months = getPast12Months();

        // Current window: past 12 months
        const currentStart = new Date(months[0].year, months[0].monthNum - 1, 1);
        const currentEnd = new Date(months[11].year, months[11].monthNum, 0, 23, 59, 59);

        // Previous window: the 12 months before that (for YoY comparison)
        const previousStart = new Date(currentStart);
        previousStart.setFullYear(previousStart.getFullYear() - 1);
        const previousEnd = new Date(currentStart);

        // ── Volunteers ────────────────────────────────────────────────────────
        const [volunteersCurrentRaw, volunteersPreviousRaw] = await Promise.all([
            Volunteer.aggregate([
                { $match: { createdAt: { $gte: currentStart, $lte: currentEnd }, isApproved: true } },
                { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } }
            ]),
            Volunteer.aggregate([
                { $match: { createdAt: { $gte: previousStart, $lt: previousEnd }, isApproved: true } },
                { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } }
            ])
        ]);

        // ── Organizers ────────────────────────────────────────────────────────
        const [organizerCurrentRaw, organizerPreviousRaw] = await Promise.all([
            Organizer.aggregate([
                { $match: { createdAt: { $gte: currentStart, $lte: currentEnd }, isApproved: true } },
                { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } }
            ]),
            Organizer.aggregate([
                { $match: { createdAt: { $gte: previousStart, $lt: previousEnd }, isApproved: true } },
                { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } }
            ])
        ]);

        // ── Active Events ─────────────────────────────────────────────────────
        const [eventsCurrentRaw, eventsPreviousRaw] = await Promise.all([
            Event.aggregate([
                { $addFields: { eventDate: { $dateFromString: { dateString: '$startdate' } } } },
                { $match: { isApproved: true, eventDate: { $gte: currentStart, $lte: currentEnd } } },
                { $group: { _id: { month: { $month: '$eventDate' }, year: { $year: '$eventDate' } }, count: { $sum: 1 }, volunteersRegistered: { $sum: { $ifNull: ['$volunteersRegistered', 0] } } } }
            ]),
            Event.aggregate([
                { $addFields: { eventDate: { $dateFromString: { dateString: '$startdate' } } } },
                { $match: { isApproved: true, eventDate: { $gte: previousStart, $lt: previousEnd } } },
                { $group: { _id: { month: { $month: '$eventDate' }, year: { $year: '$eventDate' } }, count: { $sum: 1 }, volunteersRegistered: { $sum: { $ifNull: ['$volunteersRegistered', 0] } } } }
            ])
        ]);

        // ── Fill month-by-month arrays (current window only, for chart) ───────
        // FIX: Match using m.monthNum and m.year, not array index
        const fillMonths = (data, field) => {
            return months.map(m => {
                const match = data.find(d => d._id.month === m.monthNum && d._id.year === m.year);
                if (!match) return 0;
                return field === 'hoursWorked' ? (match.volunteersRegistered || 0) : (match.count || 0);
            });
        };

        const analytics = {
            hoursWorked:  fillMonths(eventsCurrentRaw,    'hoursWorked'),
            volunteers:   fillMonths(volunteersCurrentRaw, 'count'),
            organizer:    fillMonths(organizerCurrentRaw,  'count'),
            activeEvents: fillMonths(eventsCurrentRaw,     'count'),
        };

        // ── YoY totals (sum of entire 12-month window vs previous 12-month window) ──
        const sum = arr => arr.reduce((a, b) => a + b, 0);

        const prevTotals = {
            hoursWorked:  eventsPreviousRaw.reduce((a, d) => a + (d.volunteersRegistered || 0), 0),
            volunteers:   volunteersPreviousRaw.reduce((a, d) => a + d.count, 0),
            organizer:    organizerPreviousRaw.reduce((a, d) => a + d.count, 0),
            activeEvents: eventsPreviousRaw.reduce((a, d) => a + d.count, 0),
        };

        const trendStatement = {
            hoursWorked:  calculateYoYTrend(sum(analytics.hoursWorked),  prevTotals.hoursWorked),
            volunteers:   calculateYoYTrend(sum(analytics.volunteers),   prevTotals.volunteers),
            organizer:    calculateYoYTrend(sum(analytics.organizer),     prevTotals.organizer),
            activeEvents: calculateYoYTrend(sum(analytics.activeEvents),  prevTotals.activeEvents),
        };

        res.json({
            analytics,
            trendStatement,
            months: months.map(m => m.month)
        });

    } catch (error) {
        console.error('❌ Analytics error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;