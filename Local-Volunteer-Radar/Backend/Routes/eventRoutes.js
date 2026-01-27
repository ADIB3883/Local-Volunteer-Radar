const express = require('express');
const router = express.Router();
const Event = require("../models/Event");

router.put("/events/approve/:eventId", async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate(
            { eventId: Number(req.params.eventId) },
            { $set: {
                isApproved: true,
                    isPending: false
            } },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event approved successfully", event });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put("/events/reject/:eventId", async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate(
            { eventId: Number(req.params.eventId) },
            { $set: {
                    isApproved: false,
                    isPending: false
                } },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event rejected", event });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET /api/events/pending
router.get("/events/pending", async (req, res) => {
    try {
        const events = await Event.find({ isPending: true }).sort({ date: 1 });
        res.json({ events });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;