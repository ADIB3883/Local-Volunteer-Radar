const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

router.get('/profile/:id', async (req, res) => {
    try {
        const loggedInUser = JSON.parse(req.headers['user-data'] || '{}');
        const email = loggedInUser.email;

        if (!email) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const volunteer = await Volunteer.findOne({ email });

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: 'Volunteer profile not found'
            });
        }

        res.json({
            success: true,
            user: volunteer
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

router.put('/profile/:id', async (req, res) => {
    try {
        const { phoneNumber, address, bio, skills, availability, profilePicture } = req.body;
        const loggedInUser = JSON.parse(req.headers['user-data'] || '{}');
        const email = loggedInUser.email;

        if (!email) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        console.log('Update profile attempt for:', email);
        console.log('Received data:', req.body);

        const updateData = {
            phoneNumber,
            address,
            bio,
            skills,
            availability: availability.map(slot => ({
                day: slot.day,
                startTime: slot.startTime,
                endTime: slot.endTime
            })),
            profilePicture
        };

        const volunteer = await Volunteer.findOneAndUpdate(
            { email },
            updateData,
            { new: true, runValidators: true }
        );

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: 'Volunteer profile not found'
            });
        }

        console.log('✅ Profile updated successfully for:', email);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: volunteer
        });
    } catch (error) {
        console.error('❌ Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during profile update'
        });
    }
});

module.exports = router;
