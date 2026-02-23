const express = require('express');
const router = express.Router();
const { oauth2Client } = require('../services/googleCalendarService');
const User = require('../Models/User');

router.get('/google/auth-url', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.events']
    });
    res.json({ url });
});

router.get('/google/callback', async (req, res) => {
    const { code, state } = req.query;

    try {
        const { tokens } = await oauth2Client.getToken(code);

        // Store tokens in user's database record
        const userEmail = decodeURIComponent(state);
        await User.findOneAndUpdate(
            { email: userEmail },
            {
                googleAccessToken: tokens.access_token,
                googleRefreshToken: tokens.refresh_token
            }
        );

        // Send success message to parent window
        res.send(`
            <html>
                <script>
                    window.opener.postMessage('calendar-connected', '*');
                    window.close();
                </script>
                <body>
                    <h2>Authentication successful! You can close this window.</h2>
                </body>
            </html>
        `);
    } catch (error) {
        console.error('Error getting tokens:', error);
        res.send(`
            <html>
                <body>
                    <h2>Authentication failed. Please try again.</h2>
                    <script>setTimeout(() => window.close(), 2000);</script>
                </body>
            </html>
        `);
    }
});

router.get('/google-tokens/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });

        if (!user) {
            return res.status(404).json({
                googleAccessToken: null,
                googleRefreshToken: null
            });
        }

        res.json({
            googleAccessToken: user.googleAccessToken,
            googleRefreshToken: user.googleRefreshToken
        });
    } catch (error) {
        console.error('Error fetching Google tokens:', error);
        res.status(500).json({
            googleAccessToken: null,
            googleRefreshToken: null
        });
    }
});


router.post('/google/disconnect/:email', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            {
                googleAccessToken: null,
                googleRefreshToken: null
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Google Calendar disconnected successfully' });
    } catch (error) {
        console.error('Error disconnecting calendar:', error);
        res.status(500).json({ success: false, message: 'Failed to disconnect calendar' });
    }
});

module.exports = router;
