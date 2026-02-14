const express = require("express");
const router = express.Router();
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

        // Basic validation
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
4️⃣ GET SINGLE EVENT BY ID
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


module.exports = router;