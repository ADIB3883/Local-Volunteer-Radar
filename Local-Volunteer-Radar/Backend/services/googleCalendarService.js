const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

async function addEventToCalendar(accessToken, eventDetails) {
    try {
        oauth2Client.setCredentials({ access_token: accessToken });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const event = {
            summary: eventDetails.title,
            description: eventDetails.description,
            location: eventDetails.location,
            start: {
                dateTime: eventDetails.startDate,
                timeZone: 'Asia/Dhaka',
            },
            end: {
                dateTime: eventDetails.endDate,
                timeZone: 'Asia/Dhaka',
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 30 },
                ],
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,});

        return response.data;
    } catch (error) {
        console.error('Error adding event to calendar:', error);
        throw error;
    }
}

module.exports = { oauth2Client, addEventToCalendar };
