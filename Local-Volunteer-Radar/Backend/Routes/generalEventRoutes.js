const express = require('express');
const router = express.Router();
const Event = require("../models/Event");

// POST /api/events - Create a new event (Organizer)
router.post("/events", async (req, res) => {
    try {
        const { title, organizerId, description, tags, date, time, location, distance, requirements, volunteersNeeded } = req.body;

        // Validate required fields
        if (!title || !organizerId || !description || !date || !time || !location) {
            return res.status(400).json({ message: "Missing required fields", received: req.body });
        }

        // Get the next eventId (auto-increment)
        const lastEvent = await Event.findOne().sort({ eventId: -1 });
        const nextEventId = lastEvent ? lastEvent.eventId + 1 : 1;

        const newEvent = new Event({
            eventId: nextEventId,
            title,
            organizerId: organizerId,
            description,
            tags: tags || [],
            date,
            time,
            location,
            distance: distance || 0,
            requirements: requirements || "",
            volunteersNeeded: volunteersNeeded || 10,
            volunteersRegistered: 0,
            registrationsClosed: false,
            isPending: true,
            isApproved: false
        });

        const savedEvent = await newEvent.save();
        console.log('✅ Event created:', savedEvent);
        res.status(201).json({ message: "Event created successfully", event: savedEvent });
    } catch (error) {
        console.error('❌ Error creating event:', error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET /api/events/organizer/:organizerId - Get all events for an organizer
router.get("/events/organizer/:organizerId", async (req, res) => {
    try {
        const { organizerId } = req.params;
        const events = await Event.find({ organizerId }).sort({ createdAt: -1 });
        res.json({ events });
    } catch (err) {
        console.error('❌ Error fetching organizer events:', err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// PUT /api/events/:eventId/close-registrations - Close registrations and prepare for admin approval
router.put("/events/:eventId/close-registrations", async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate(
            { eventId: Number(req.params.eventId) },
            { 
                $set: {
                    registrationsClosed: true,
                    isPending: true,
                    isApproved: false
                } 
            },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        console.log('✅ Registrations closed for event:', event.eventId);
        res.json({ message: "Registrations closed. Event ready for admin review.", event });
    } catch (error) {
        console.error('❌ Error closing registrations:', error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET /api/events/approved - Get approved events for Volunteers
router.get("/events/approved", async (req, res) => {
    try {
        const events = await Event.find({ isPending: false, isApproved: true }).sort({ date: 1 });
        res.json({ events });
    } catch (err) {
        console.error('❌ Error fetching approved events:', err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// POST /api/events/:eventId/register - Register a volunteer for an event
router.post("/events/:eventId/register", async (req, res) => {
    try {
        const { eventId } = req.params;
        const { volunteerEmail, volunteerName } = req.body;

        if (!volunteerEmail || !volunteerName) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if event is approved before allowing registration
        const eventCheck = await Event.findOne({ eventId: Number(eventId) });
        if (!eventCheck || eventCheck.isPending || !eventCheck.isApproved) {
            return res.status(400).json({ message: "Can only register for approved events" });
        }

        // Check if event has capacity
        if (eventCheck.volunteersRegistered >= eventCheck.volunteersNeeded) {
            return res.status(400).json({ message: `Event is full (${eventCheck.volunteersNeeded}/${eventCheck.volunteersNeeded} volunteers registered)` });
        }

        // Find and update the event - increment volunteersRegistered
        const event = await Event.findOneAndUpdate(
            { eventId: Number(eventId) },
            { $inc: { volunteersRegistered: 1 } },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        console.log(`✅ Volunteer ${volunteerEmail} registered for event ${eventId}. Updated count: ${event.volunteersRegistered}`);
        res.json({ 
            message: "Registration successful", 
            event,
            volunteersRegistered: event.volunteersRegistered
        });
    } catch (error) {
        console.error('❌ Error registering volunteer:', error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PUT /api/events/:eventId/complete - Mark event as completed
router.put("/events/:eventId/complete", async (req, res) => {
    try {
        const { eventId } = req.params;
        
        const event = await Event.findOneAndUpdate(
            { eventId: Number(eventId) },
            { 
                $set: {
                    isPending: false,
                    isApproved: false
                } 
            },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        console.log(`✅ Event ${eventId} marked as completed`);
        res.json({ message: "Event marked as completed", event });
    } catch (error) {
        console.error('❌ Error completing event:', error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
