const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Volunteer = mongoose.model('Volunteer');
const Organizer = mongoose.model('Organizer');
const User = mongoose.model('User');

// ✅ 1. ROOT ROUTE FIRST - http://localhost:5000/api/users
router.get('/', async (req, res) => {
    try {
        const volunteers = await Volunteer.find({ isApproved: true }).select('-__v');
        const organizers = await Organizer.find({ isApproved: true }).select('-__v');

        const allUsers = [
            ...volunteers.map(v => ({ ...v.toObject(), type: 'volunteer' })),
            ...organizers.map(o => ({ ...o.toObject(), type: 'organizer' }))
        ];

        res.json({ success: true, data: allUsers });
    } catch (error) {
        console.error('Users error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ 2. PENDING ROUTE - http://localhost:5000/api/users/pending
router.get('/pending', async (req, res) => {
    try {
        const pendingVolunteers = await Volunteer.find({ isPending: true }).select('-__v');
        const pendingOrganizers = await Organizer.find({ isPending: true }).select('-__v');

        const pendingUsers = [
            ...pendingVolunteers.map(v => ({ ...v.toObject(), type: 'volunteer' })),
            ...pendingOrganizers.map(o => ({ ...o.toObject(), type: 'organizer' }))
        ];

        res.json({ success: true, data: pendingUsers });
    } catch (error) {
        console.error('Pending error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ 3. Your existing approve/reject routes (keep these LAST)
router.patch('/approve/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid user ID' });
        }

        const Model = type === 'volunteer' ? Volunteer : Organizer;
        const user = await Model.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, error: `${type} not found` });
        }

        // Update approval status
        user.isApproved = true;
        user.isPending = false;
        await user.save();

        res.json({ success: true, message: `${type} approved successfully`, data: user });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete('/reject/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid user ID' });
        }

        const Model = type === 'volunteer' ? Volunteer : Organizer;
        const user = await Model.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, error: `${type} not found` });
        }

        // Delete from Volunteer/Organizer collection
        await Model.findByIdAndDelete(id);

        // Delete from User collection if exists
        if (user.email) {
            await User.deleteOne({ email: user.email });
        }

        res.json({ success: true, message: `${type} rejected and removed successfully` });
    } catch (error) {
        console.error('Error rejecting user:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;