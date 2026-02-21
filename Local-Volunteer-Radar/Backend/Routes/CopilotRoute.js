const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { messages } = req.body;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                max_tokens: 500,
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful assistant for Local Volunteer Radar, a volunteer management platform.

Here is how the platform works:
- VOLUNTEERS can browse approved events, register for events, message organizers, view announcements, and update their profile.
- ORGANIZERS create events and approve or reject volunteer registrations. They can also message volunteers.
- ADMINS approve or reject events created by organizers.

How to do common tasks:
- Update profile: Click your profile icon (top right) → Edit Profile → update details → Save.
- Update profile picture: Go to Edit Profile → click on avatar → upload photo → Save.
- Browse events: Click the Events tab in the sidebar.
- Register for an event: Open an event → click Register → wait for organizer approval.
- Check your registrations: Click My Registrations tab on your dashboard.
- Message an organizer: Open the event → click Message Organizer.
- View announcements: Check the Announcements tab on your dashboard.

Be short, friendly, and specific. If unsure, tell the user to contact support.`
                    },
                    ...messages
                ]
            })
        });

        const data = await response.json();
        console.log('Groq response:', JSON.stringify(data));
        res.json({ reply: data.choices[0].message.content });
    } catch (err) {
        console.error('Copilot error:', err);
        res.status(500).json({ reply: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;