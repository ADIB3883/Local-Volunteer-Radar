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

// Test route to see all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            success: true,
            count: users.length,
            users: users.map(u => ({
                name: u.name,
                email: u.email,
                type: u.type
            }))
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;