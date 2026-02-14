const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const Organizer = require('../models/Organizer');

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, userType, phoneNumber, address, skills, description } = req.body;
        console.log('Signup attempt:', { email, userType });

        if (!name || !email || !password || !userType) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (name, email, password, userType)'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'This email is already registered!'
            });
        }

        // Create authentication entry
        const newUser = new User({
            email,
            password, // hash in production
            type: userType
        });

        await newUser.save();

        let profileData = {};
        if (userType === 'volunteer') {
            const volunteer = new Volunteer({
                name,
                email,
                phoneNumber,
                address,
                skills,
                isPending: true,
                isApproved: false,
                type: userType
            });
            await volunteer.save();
            profileData = {
                name: volunteer.name,
                phoneNumber: volunteer.phoneNumber,
                address: volunteer.address,
                skills: volunteer.skills
            };
        } else if (userType === 'organizer') {
            const { organizationType } = req.body;
            const organizer = new Organizer({
                name,
                email,
                phoneNumber,
                address,
                organizationType,
                description,
                isPending: true,
                isApproved: false,
                type: userType
            });
            await organizer.save();
            profileData = {
                name: organizer.name,
                phoneNumber: organizer.phoneNumber,
                address: organizer.address,
                organizationType: organizer.organizationType,
                description: organizer.description
            };
        }


        console.log('✅ User created successfully:', email);

        return res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            user: {
                id: newUser._id,
                email: newUser.email,
                role: newUser.type,
                ...profileData
            }
        });
    } catch (error) {
        console.error('❌ Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup'
        });
    }
});

module.exports = router;