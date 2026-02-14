const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Volunteer = mongoose.model('Volunteer');
const Organizer = mongoose.model('Organizer');
const User = mongoose.model('User');

// Approve a user (Volunteer or Organizer)
router.patch('/approve/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;

        let user;
        if (type === 'volunteer') {
            user = await Volunteer.findByIdAndUpdate(
                id,
                {
                    isPending: false,
                    isApproved: true
                },
                { new: true }
            );
        } else if (type === 'organizer') {
            user = await Organizer.findByIdAndUpdate(
                id,
                {
                    isPending: false,
                    isApproved: true
                },
                { new: true }
            );
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid user type'
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} approved successfully`,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving user',
            error: error.message
        });
    }
});

// Reject a user (Volunteer or Organizer)
router.delete('/reject/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;

        let user;
        let email;

        if (type === 'volunteer') {
            user = await Volunteer.findById(id);
            if (user) {
                email = user.email;
                await Volunteer.findByIdAndDelete(id);
            }
        } else if (type === 'organizer') {
            user = await Organizer.findById(id);
            if (user) {
                email = user.email;
                await Organizer.findByIdAndDelete(id);
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid user type'
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete from Users collection using email
        if (email) {
            await User.findOneAndDelete({ email: email });
        }

        res.status(200).json({
            success: true,
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} rejected and removed successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting user',
            error: error.message
        });
    }
});

// Get all pending users
router.get('/pending', async (req, res) => {
    try {
        const pendingVolunteers = await Volunteer.find({ isPending: true });
        const pendingOrganizers = await Organizer.find({ isPending: true });

        res.status(200).json({
            success: true,
            data: {
                volunteers: pendingVolunteers,
                organizers: pendingOrganizers
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching pending users',
            error: error.message
        });
    }
});

module.exports = router;
