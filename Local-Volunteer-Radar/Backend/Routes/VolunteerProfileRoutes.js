const express = require('express');
const { cloudinary, upload } = require('../services/cloudinary');
const router = express.Router();
const Volunteer = require('../Models/Volunteer');
const User = require('../Models/User');

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

// POST /api/profile/upload-picture
router.post('/profile/upload-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Cloudinary URL is automatically available
        const imageUrl = req.file.path;

        res.json({
            success: true,
            imageUrl,
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ success: false, message: 'Image upload failed' });
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
