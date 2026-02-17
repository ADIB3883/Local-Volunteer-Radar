const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Event = require("../Models/Event");

/*
1️⃣ CREATE EVENT
POST /api/events
*/
router.post("/", async (req, res) => {
    try {
        const {
            organizerId,
            eventName,
            description,
            category,
            location,
            startdate,
            enddate,
            startTime,
            endTime,
            volunteersNeeded,
            requirements,
        } = req.body;

        // Validate required fields
        if (
            !organizerId ||
            !eventName ||
            !description ||
            !category ||
            !location ||
            !startdate ||
            !enddate ||
            !startTime ||
            !endTime ||
            !volunteersNeeded
        ) {
            return res.status(400).json({ message: "All required fields must be filled." });
        }

        // Validate organizerId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(organizerId)) {
            return res.status(400).json({ message: "Invalid organizerId format." });
        }

        const newEvent = new Event({
            organizerId,
            eventName,
            description,
            category,
            location,
            startdate,
            enddate,
            startTime,
            endTime,
            volunteersNeeded,
            requirements: requirements || "",
            volunteersRegistered: 0,
            status: 'pending',
            isApproved: false,
        });

        await newEvent.save();

        res.status(201).json(newEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while creating event." });
    }
});

//Get all pending events
router.get("/pending", async (req, res) => {
    try {
        const events = await Event.find({ isApproved: false })
            .sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


/*
2️⃣ GET EVENTS BY ORGANIZER
GET /api/events/organizer/:organizerId
*/
router.get("/organizer/:organizerId", async (req, res) => {
    try {
        const { organizerId } = req.params;

        const events = await Event.find({ organizerId }).sort({ createdAt: -1 });

        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching events." });
    }
});

/*
3️⃣ GET ORGANIZER STATS
GET /api/events/stats/:organizerId
*/
router.get("/stats/:organizerId", async (req, res) => {
    try {
        const { organizerId } = req.params;

        const events = await Event.find({ organizerId });

        const activeEvents = events.filter(e => e.status === "active").length;

        const totalVolunteers = events.reduce((sum, event) => {
            return sum + (event.volunteersRegistered || 0);
        }, 0);

        const totalEvents = events.length;

        res.json({
            activeEvents,
            totalVolunteers,
            totalEvents,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error calculating stats." });
    }
});

/*
4️⃣ GET ADMIN PENDING EVENTS (by approval status)
GET /api/admin/events/admin-pending
*/
router.get("/admin-pending", async (req, res) => {
    try {
        // Explicitly filter by isApproved === false
        const events = await Event.find({ isApproved: { $eq: false } })
            .populate('organizerId', 'name email')
            .sort({ createdAt: -1 });

        // Double-check before sending (defensive programming)
        const validPendingEvents = events.filter(event => event.isApproved === false);

        res.json(validPendingEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching pending events." });
    }
});

/*
GET ACTIVE EVENTS (approved events with upcoming dates)
GET /api/events/active
*/
router.get("/active", async (req, res) => {
    try {
        const today = new Date();
        // Start of today
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const events = await Event.find({
            isApproved: true,
            startdate: { $gte: startOfToday.toISOString().split('T')[0] },
            status: { $ne: 'cancelled' }
        })
            .populate('organizerId', 'name email')
            .sort({ startdate: 1, startTime: 1 });

        // Map events to include proper volunteer count from registrations array
        const eventsWithProperCounts = events.map(event => ({
            ...event.toObject(),
            volunteersRegistered: event.registrations ? event.registrations.length : 0
        }));

        res.json(eventsWithProperCounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching active events." });
    }
});

/*
5️⃣ GET SINGLE EVENT BY ID
GET /api/events/:eventId
*/
router.get("/:eventId", async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId)
            .populate('organizerId', 'name email')
            .populate('registrations.volunteer', 'name email');

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching event." });
    }
});

/*
5️⃣ UPDATE EVENT
PUT /api/events/:eventId
*/
router.put("/:eventId", async (req, res) => {
    try {
        const { eventId } = req.params;
        const updates = req.body;

        const event = await Event.findByIdAndUpdate(
            eventId,
            updates,
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while updating event." });
    }
});

/*
6️⃣ DELETE EVENT
DELETE /api/events/:eventId
*/
router.delete("/:eventId", async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findByIdAndDelete(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        res.json({ message: "Event deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while deleting event." });
    }
});

/*
7️⃣ GET ALL EVENTS (for admin or public view)
GET /api/events
*/
router.get("/", async (req, res) => {
    try {
        const { status } = req.query;

        let query = {};
        if (status) {
            query.status = status;
        }

        const events = await Event.find(query)
            .populate('organizerId', 'name email')
            .sort({ createdAt: -1 });

        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching events." });
    }
});

/*
8️⃣ SEND ANNOUNCEMENT
POST /api/events/:eventId/announcements
*/
router.post("/:eventId/announcements", async (req, res) => {
    try {
        const { eventId } = req.params;
        const { title, message, sentBy } = req.body;

        if (!title || !message) {
            return res.status(400).json({ message: "Title and message are required." });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        // Create new announcement
        const announcement = {
            title,
            message,
            sentBy: sentBy || event.organizerId,
            sentAt: new Date()
        };

        event.announcements.push(announcement);
        await event.save();

        res.json({
            message: "Announcement sent successfully",
            announcement: event.announcements[event.announcements.length - 1]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while sending announcement." });
    }
});

/*
9️⃣ GET ANNOUNCEMENTS FOR EVENT
GET /api/events/:eventId/announcements
*/
router.get("/:eventId/announcements", async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId)
            .populate('announcements.sentBy', 'name email');

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        res.json(event.announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching announcements." });
    }
});

/*
🔟 GET ALL ANNOUNCEMENTS FOR ORGANIZER
GET /api/events/organizer/:organizerId/announcements
*/
router.get("/organizer/:organizerId/announcements", async (req, res) => {
    try {
        const { organizerId } = req.params;

        const events = await Event.find({ organizerId })
            .populate('announcements.sentBy', 'name email');

        // Flatten all announcements from all events
        const allAnnouncements = events.flatMap(event =>
            event.announcements.map(announcement => ({
                ...announcement.toObject(),
                eventId: event._id,
                eventName: event.eventName
            }))
        );

        // Sort by date (newest first)
        allAnnouncements.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

        res.json(allAnnouncements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching announcements." });
    }
});

/*
1️⃣1️⃣ MARK EVENT AS COMPLETED
PUT /api/events/:eventId/complete
*/
router.put("/:eventId/complete", async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findByIdAndUpdate(
            eventId,
            {
                status: 'completed',
                completedAt: new Date()
            },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        res.json({ message: "Event marked as completed", event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while completing event." });
    }
});

/*
1️⃣2️⃣ CANCEL EVENT
PUT /api/events/:eventId/cancel
*/
router.put("/:eventId/cancel", async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findByIdAndUpdate(
            eventId,
            {
                status: 'cancelled',
                cancelledAt: new Date()
            },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        res.json({ message: "Event cancelled successfully", event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while cancelling event." });
    }
});

/*
VOLUNTEER REGISTRATION ENDPOINT
POST /api/events/:eventId/register
*/
router.post("/:eventId/register", async (req, res) => {
    try {
        const { eventId } = req.params;
        const { volunteerId, volunteerEmail, volunteerName } = req.body;

        if (!volunteerId && !volunteerEmail) {
            return res.status(400).json({
                success: false,
                message: "Volunteer ID or email is required."
            });
        }

        // Find the event
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found."
            });
        }

        // Check if event is full
        if (event.volunteersRegistered >= event.volunteersNeeded) {
            return res.status(400).json({
                success: false,
                message: "Event is already full."
            });
        }

        // Check if volunteer is already registered
        const alreadyRegistered = event.registrations.some(
            reg => reg.volunteer && reg.volunteer.toString() === volunteerId
        );

        if (alreadyRegistered) {
            return res.status(400).json({
                success: false,
                message: "You are already registered for this event."
            });
        }

        // Add registration
        event.registrations.push({
            volunteer: volunteerId,
            status: "pending",
            registeredAt: new Date()
        });

        // Increment registered count
        event.volunteersRegistered = event.volunteersRegistered + 1;

        await event.save();

        res.json({
            success: true,
            message: "Successfully registered for the event!",
            event: event
        });

    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({
            success: false,
            message: "Server error while registering for event."
        });
    }
});

/*
GET VOLUNTEER'S REGISTRATIONS
GET /api/events/volunteer/:volunteerId/registrations
*/
router.get("/volunteer/:volunteerId/registrations", async (req, res) => {
    try {
        const { volunteerId } = req.params;

        // Find all events where this volunteer is registered
        const events = await Event.find({
            "registrations.volunteer": volunteerId
        })
            .populate('organizerId', 'name email')
            .sort({ startdate: 1 });

        // Filter to get only this volunteer's registrations
        const registrations = events.map(event => {
            const registration = event.registrations.find(
                reg => reg.volunteer && reg.volunteer.toString() === volunteerId
            );
            return {
                event: event,
                registrationStatus: registration ? registration.status : 'unknown',
                registeredAt: registration ? registration.registeredAt : null
            };
        });

        res.json({
            success: true,
            registrations: registrations
        });

    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching registrations."
        });
    }
});

/*
CANCEL REGISTRATION
DELETE /api/events/:eventId/register/:volunteerId
*/
router.delete("/:eventId/register/:volunteerId", async (req, res) => {
    try {
        const { eventId, volunteerId } = req.params;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found."
            });
        }

        // Find and remove the registration
        const registrationIndex = event.registrations.findIndex(
            reg => reg.volunteer && reg.volunteer.toString() === volunteerId
        );

        if (registrationIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Registration not found."
            });
        }

        event.registrations.splice(registrationIndex, 1);
        event.volunteersRegistered = Math.max(0, event.volunteersRegistered - 1);

        await event.save();

        res.json({
            success: true,
            message: "Registration cancelled successfully."
        });

    } catch (error) {
        console.error('Error cancelling registration:', error);
        res.status(500).json({
            success: false,
            message: "Server error while cancelling registration."
        });
    }
});

//Event er volunteer
router.get("/:eventId/volunteers", async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId)
            .populate("registrations.volunteer", "name email phoneNumber skills");

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event.registrations);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error fetching volunteers" });
    }
});



module.exports = router;