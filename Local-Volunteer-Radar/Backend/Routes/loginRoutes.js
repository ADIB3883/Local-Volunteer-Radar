const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const Organizer = require('../models/Organizer');

router.post('/login', async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        console.log('Login attempt:', { email, userType });

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email });
        console.log('Found user:', user ? 'Yes' : 'No');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (user.type !== userType) {
            return res.status(401).json({
                success: false,
                message: `This email is not registered as a ${userType}`
            });
        }

        if (password !== user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        let isApproved = false;
        if (userType === 'volunteer') {
            const volunteer = await Volunteer.findOne({ email });
            if (!volunteer) {
                return res.status(404).json({
                    success: false,
                    message: 'Volunteer profile not found'
                });
            }
            isApproved = volunteer.isApproved;
        } else if (userType === 'organizer') {
            const organizer = await Organizer.findOne({email});
            if (!organizer) {
                return res.status(404).json({
                    success: false,
                    message: 'Organizer profile not found'
                });
            }
            isApproved = organizer.isApproved;
        } else if (userType === 'admin') {
            const admin = await User.findOne({email});
            if (!admin || admin.type !== 'admin') {
                return res.status(404).json({
                    success: false,
                    message: 'Admin profile not found'
                });
            }
            isApproved = true;
        }

        if (!isApproved) {
            return res.status(403).json({
                success: false,
                message: 'Your account is pending approval. Please wait for admin approval before logging in.'
            });
        }

        // Fetch profile data based on user type
        let profileData = {};
        if (userType === 'volunteer') {
            const volunteer = await Volunteer.findOne({ email });
            if (volunteer) {
                profileData = {
                    name: volunteer.name,
                    phoneNumber: volunteer.phoneNumber || '',
                    address: volunteer.address || '',
                    skills: volunteer.skills || {},
                    bio: volunteer.bio || '',
                    availability: volunteer.availability || [],
                    profilePicture: volunteer.profilePicture || ''
                };
            }
        } else if (userType === 'organizer') {
            const organizer = await Organizer.findOne({ email });
            if (organizer) {
                profileData = {
                    name: organizer.name,
                    phoneNumber: organizer.phoneNumber || '',
                    address: organizer.address || '',
                    description: organizer.description || ''
                };
            }
        }

        console.log('✅ Login successful for:', user.email);
        return res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                role: user.type,
                ...profileData
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

module.exports = router;