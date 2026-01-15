const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const VOLUNTEERS_FILE = path.join(DATA_DIR, 'volunteers.json');
const ORGANIZERS_FILE = path.join(DATA_DIR, 'organizers.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, 'announcements.json');

// Initialize data directory and files
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const initializeFile = (filePath, defaultData = []) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
};

initializeFile(VOLUNTEERS_FILE);
initializeFile(ORGANIZERS_FILE);
initializeFile(EVENTS_FILE);
initializeFile(REGISTRATIONS_FILE);
initializeFile(NOTIFICATIONS_FILE);
initializeFile(ANNOUNCEMENTS_FILE);

// Helper functions for file operations
const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
};

const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing to ${filePath}:`, error);
        return false;
    }
};

// Auth Routes
app.post('/api/auth/signup/volunteer', async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, address, skills } = req.body;

        // Validate input
        if (!fullName || !email || !password || !phoneNumber || !address) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const volunteers = readData(VOLUNTEERS_FILE);

        // Check if email already exists
        const existingVolunteer = volunteers.find(v => v.email === email);
        if (existingVolunteer) {
            return res.status(400).json({ error: 'This email is already registered!' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new volunteer
        const newVolunteer = {
            id: Date.now(),
            role: 'volunteer',
            fullName,
            email,
            password: hashedPassword,
            phoneNumber,
            address,
            skills: skills || {}
        };

        volunteers.push(newVolunteer);
        writeData(VOLUNTEERS_FILE, volunteers);

        // Create JWT token
        const token = jwt.sign(
            { id: newVolunteer.id, email: newVolunteer.email, role: 'volunteer' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user data without password
        const { password: _, ...userWithoutPassword } = newVolunteer;

        res.status(201).json({
            message: 'Account created successfully!',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

app.post('/api/auth/signup/organizer', async (req, res) => {
    try {
        const { organizationName, email, password, phoneNumber, organizationType, description, address } = req.body;

        // Validate input
        if (!organizationName || !email || !password || !phoneNumber || !organizationType || !description || !address) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const organizers = readData(ORGANIZERS_FILE);

        // Check if email already exists
        const existingOrganizer = organizers.find(o => o.email === email);
        if (existingOrganizer) {
            return res.status(400).json({ error: 'This email is already registered!' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new organizer
        const newOrganizer = {
            id: Date.now(),
            role: 'organizer',
            organizationName,
            email,
            password: hashedPassword,
            phoneNumber,
            organizationType,
            description,
            address
        };

        organizers.push(newOrganizer);
        writeData(ORGANIZERS_FILE, organizers);

        // Create JWT token
        const token = jwt.sign(
            { id: newOrganizer.id, email: newOrganizer.email, role: 'organizer' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user data without password
        const { password: _, ...userWithoutPassword } = newOrganizer;

        res.status(201).json({
            message: 'Account created successfully!',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, userType } = req.body;

        // Validate input
        if (!email || !password || !userType) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Handle admin login
        if (userType === 'admin') {
            if (email === 'admin@gmail.com' && password === 'admin123') {
                const token = jwt.sign(
                    { email, role: 'admin' },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );
                return res.json({
                    message: 'Login successful',
                    token,
                    user: { role: 'admin', email }
                });
            } else {
                return res.status(401).json({ error: 'Invalid admin credentials' });
            }
        }

        let users = [];
        if (userType === 'volunteer') {
            users = readData(VOLUNTEERS_FILE);
        } else if (userType === 'organizer') {
            users = readData(ORGANIZERS_FILE);
        } else {
            return res.status(400).json({ error: 'Invalid user type' });
        }

        // Find user by email
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: userType },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Events Routes
app.get('/api/events', (req, res) => {
    try {
        const events = readData(EVENTS_FILE);
        res.json(events);
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ error: 'Server error fetching events' });
    }
});

app.post('/api/events', (req, res) => {
    try {
        const events = readData(EVENTS_FILE);
        const newEvent = {
            id: Date.now(),
            ...req.body
        };
        events.push(newEvent);
        writeData(EVENTS_FILE, events);
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Server error creating event' });
    }
});

app.put('/api/events/:id', (req, res) => {
    try {
        const events = readData(EVENTS_FILE);
        const eventId = parseInt(req.params.id);
        const index = events.findIndex(e => e.id === eventId);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Event not found' });
        }

        events[index] = { ...events[index], ...req.body };
        writeData(EVENTS_FILE, events);
        res.json(events[index]);
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ error: 'Server error updating event' });
    }
});

// Registrations Routes
app.get('/api/registrations', (req, res) => {
    try {
        const registrations = readData(REGISTRATIONS_FILE);
        res.json(registrations);
    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({ error: 'Server error fetching registrations' });
    }
});

app.post('/api/registrations', (req, res) => {
    try {
        const registrations = readData(REGISTRATIONS_FILE);
        const newRegistration = {
            id: Date.now(),
            ...req.body
        };
        registrations.push(newRegistration);
        writeData(REGISTRATIONS_FILE, registrations);
        res.status(201).json(newRegistration);
    } catch (error) {
        console.error('Create registration error:', error);
        res.status(500).json({ error: 'Server error creating registration' });
    }
});

// Notifications Routes
app.get('/api/notifications', (req, res) => {
    try {
        const notifications = readData(NOTIFICATIONS_FILE);
        res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Server error fetching notifications' });
    }
});

app.post('/api/notifications', (req, res) => {
    try {
        const notifications = readData(NOTIFICATIONS_FILE);
        const newNotification = {
            id: Date.now(),
            ...req.body
        };
        notifications.push(newNotification);
        writeData(NOTIFICATIONS_FILE, notifications);
        res.status(201).json(newNotification);
    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ error: 'Server error creating notification' });
    }
});

app.put('/api/notifications/:id', (req, res) => {
    try {
        const notifications = readData(NOTIFICATIONS_FILE);
        const notificationId = parseInt(req.params.id);
        const index = notifications.findIndex(n => n.id === notificationId);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        notifications[index] = { ...notifications[index], ...req.body };
        writeData(NOTIFICATIONS_FILE, notifications);
        res.json(notifications[index]);
    } catch (error) {
        console.error('Update notification error:', error);
        res.status(500).json({ error: 'Server error updating notification' });
    }
});

// Announcements Routes
app.get('/api/announcements', (req, res) => {
    try {
        const announcements = readData(ANNOUNCEMENTS_FILE);
        res.json(announcements);
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ error: 'Server error fetching announcements' });
    }
});

app.post('/api/announcements', (req, res) => {
    try {
        const announcements = readData(ANNOUNCEMENTS_FILE);
        const newAnnouncement = {
            id: Date.now(),
            ...req.body
        };
        announcements.push(newAnnouncement);
        writeData(ANNOUNCEMENTS_FILE, announcements);
        res.status(201).json(newAnnouncement);
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ error: 'Server error creating announcement' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
