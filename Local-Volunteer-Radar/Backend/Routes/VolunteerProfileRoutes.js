const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.put('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { phoneNumber, address, bio, skills, availability, profilePicture } = req.body;

        console.log('Update profile attempt for:', userId);
        console.log('Received data:', req.body);

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields - only if they exist
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (address !== undefined) user.address = address;
        if (bio !== undefined) user.bio = bio;
        if (skills !== undefined) {
            user.skills = typeof skills === 'object' ? skills : {};
        }
        if (availability !== undefined) {
            user.availability = availability.map(slot => ({
                day: slot.day,
                startTime: slot.startTime,
                endTime: slot.endTime
            }));
        }
        if (profilePicture !== undefined) user.profilePicture = profilePicture;

        await user.save();
        console.log('Profile updated successfully for:', user.email);

        return res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                fullName: user.name,
                email: user.email,
                role: user.type,
                phoneNumber: user.phoneNumber,
                address: user.address,
                bio: user.bio,
                skills: user.skills,
                availability: user.availability || [],
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during profile update',
            error: error.message // ADD THIS FOR DEBUGGING
        });
    }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                fullName: user.name,
                email: user.email,
                role: user.type,
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                bio: user.bio || '',
                skills: user.skills || {},
                availability: user.availability || [],
                profilePicture: user.profilePicture || ''
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
});

module.exports = router;