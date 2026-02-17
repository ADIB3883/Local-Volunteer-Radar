const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sendOTPEmail } = require('../services/emailService');
const User = require('../Models/User');

const otpStore = new Map();

setInterval(() => {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(email);
        }
    }
}, 5 * 60 * 1000);

// POST /api/forgot-password/send-otp
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Received OTP request for email:', email);

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000;

        otpStore.set(email.toLowerCase(), {
            otp,
            expiresAt,
            attempts: 0,
            verified: false
        });

        await sendOTPEmail(email, otp);
        console.log(`OTP for ${email}: ${otp} (expires in 10 minutes)`);

        res.status(200).json({
            message: 'OTP sent successfully',
            expiresIn: 600
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            error: 'Failed to send OTP',
            message: error.message
        });
    }
});

// POST /api/forgot-password/verify-otp
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log('Received OTP verify request for email:', email);

        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP are required' });
        }

        const emailLower = email.toLowerCase();
        const storedData = otpStore.get(emailLower);

        if (!storedData) {
            return res.status(400).json({ error: 'No OTP found for this email. Please request a new one.' });
        }

        if (Date.now() > storedData.expiresAt) {
            otpStore.delete(emailLower);
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        if (storedData.attempts >= 5) {
            otpStore.delete(emailLower);
            return res.status(429).json({ error: 'Too many failed attempts. Please request a new OTP.' });
        }

        if (storedData.otp !== otp.toString()) {
            storedData.attempts += 1;
            return res.status(400).json({
                error: 'Invalid OTP',
                attemptsRemaining: 5 - storedData.attempts
            });
        }

        storedData.verified = true;

        res.status(200).json({
            message: 'OTP verified successfully',
            verified: true
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            error: 'Failed to verify OTP',
            message: error.message
        });
    }
});

// POST /api/forgot-password/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        console.log('Received password reset request for email:', email);

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: 'Email, OTP, and new password are required' });
        }

        const emailLower = email.toLowerCase();
        const storedData = otpStore.get(emailLower);

        if (!storedData || !storedData.verified) {
            return res.status(400).json({ error: 'OTP not verified. Please verify OTP first.' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password using Mongoose
        const result = await User.updateOne(
            { email: emailLower },
            { $set: { password: hashedPassword } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        otpStore.delete(emailLower);

        res.status(200).json({
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            error: 'Failed to reset password',
            message: error.message
        });
    }
});

module.exports = router;
