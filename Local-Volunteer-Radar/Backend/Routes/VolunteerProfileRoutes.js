const express = require('express');
const router = express.Router();
const Volunteer = require('../Models/Volunteer');
const User = require('../Models/User');

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

// DELETE volunteer by ID (for admin use)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Attempting to delete volunteer with ID:', id);
        
        // Try to find and delete the volunteer by ID
        const volunteer = await Volunteer.findById(id);
        
        if (!volunteer) {
            console.log('Volunteer not found with ID:', id);
            return res.status(404).json({
                success: false,
                message: 'Volunteer not found'
            });
        }

        // Delete the volunteer record
        await Volunteer.findByIdAndDelete(id);
        
        // Also delete the associated User record
        await User.deleteOne({ email: volunteer.email });

        console.log('✅ Volunteer deleted successfully:', volunteer.name);

        res.json({
            success: true,
            message: 'Volunteer deleted successfully'
        });
    } catch (error) {
        console.error('❌ Volunteer deletion error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during volunteer deletion'
        });
    }
});

module.exports = router;
