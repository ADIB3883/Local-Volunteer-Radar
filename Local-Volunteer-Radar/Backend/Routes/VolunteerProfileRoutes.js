const express = require('express');
const router = express.Router();
const Volunteer = require('../Models/Volunteer');

router.get('/profile/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const volunteer = await Volunteer.findOne({ email: email });

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: 'Volunteer profile not found'
            });
        }

        // ✅ Transform the response to include 'id' field
        res.json({
            success: true,
            user: {
                id: volunteer._id.toString(), // ✅ Convert _id to id
                name: volunteer.name,
                email: volunteer.email,
                phoneNumber: volunteer.phoneNumber || '',
                address: volunteer.address || '',
                skills: volunteer.skills || {},
                bio: volunteer.bio || '',
                availability: volunteer.availability || [],
                profilePicture: volunteer.profilePicture || '',
                isPending: volunteer.isPending,
                isApproved: volunteer.isApproved,
                role: 'volunteer'
            }
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

router.put('/profile/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { phoneNumber, address, bio, skills, availability, profilePicture } = req.body;

        console.log('Update request for:', email);

        const updateData = {
            phoneNumber,
            address,
            bio,
            skills,
            availability: (availability || []).map(slot => ({
                day: slot.day,
                startTime: slot.startTime,
                endTime: slot.endTime
            })),
            profilePicture
        };

        const volunteer = await Volunteer.findOneAndUpdate(
            { email },
            updateData,
            { new: true }
        );

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: 'Volunteer profile not found'
            });
        }

        console.log('Profile updated successfully for:', email);

        // ✅ Transform the response to include 'id' field
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: volunteer._id.toString(), // ✅ Convert _id to id
                name: volunteer.name,
                email: volunteer.email,
                phoneNumber: volunteer.phoneNumber || '',
                address: volunteer.address || '',
                skills: volunteer.skills || {},
                bio: volunteer.bio || '',
                availability: volunteer.availability || [],
                profilePicture: volunteer.profilePicture || '',
                isPending: volunteer.isPending,
                isApproved: volunteer.isApproved,
                role: 'volunteer'
            }
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;