const express = require('express');
const router = express.Router();
const User = require('../models/User');

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

        const user = await User.findOne({ email: email });
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
            console.log('Password mismatch:', {
                entered: password,
                inDatabase: user.password
            });
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        console.log('✅ Login successful for:', user.email);
        return res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.type
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

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, userType, phoneNumber, address, skills } = req.body;
        console.log('Signup attempt:', { email, userType });

        // Validation
        if (!name || !email || !password || !userType) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (name, email, password, userType)'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'This email is already registered!'
            });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password,
            type: userType,
            phoneNumber,
            address,
            skills
        });

        await newUser.save();
        console.log('✅ User created successfully:', email);

        return res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.type,
                phoneNumber: newUser.phoneNumber,
                address: newUser.address,
                skills: newUser.skills
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

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();

        const sanitizedUsers = users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            type: u.type,
            phoneNumber: u.phoneNumber,
            address: u.address,
            skills: u.skills,
            status: u.status,
            hoursVolunteered: u.hoursVolunteered,
            joinedDate: u.joinedDate,
            category: u.category,
            registrationNumber: u.registrationNumber,
            membersCount: u.membersCount,
            createdAt: u.createdAt
        }));

        res.json({
            success: true,
            count: sanitizedUsers.length,
            users: sanitizedUsers
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create default admin user
router.post('/create-admin', async (req, res) => {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ type: 'admin' });

        if (existingAdmin) {
            return res.json({
                success: true,
                message: 'Admin already exists',
                admin: {
                    email: existingAdmin.email,
                    password: existingAdmin.password,
                    name: existingAdmin.name
                }
            });
        }

        // Create default admin
        const admin = new User({
            name: 'Admin',
            email: 'admin@volunteer.com',
            password: 'admin123',
            type: 'admin'
        });

        await admin.save();
        console.log('✅ Default admin created');

        res.json({
            success: true,
            message: 'Admin user created successfully',
            admin: {
                email: 'admin@volunteer.com',
                password: 'admin123',
                name: 'Admin'
            }
        });
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;