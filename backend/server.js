const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Validate JWT_SECRET on startup
if (!JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    console.error('Please set JWT_SECRET environment variable before starting the server.');
    console.error('You can generate a secure secret with: openssl rand -base64 32');
    process.exit(1);
}

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
if (!fsSync.existsSync(DATA_DIR)) {
    fsSync.mkdirSync(DATA_DIR, { recursive: true });
}

const initializeFile = (filePath, defaultData = []) => {
    if (!fsSync.existsSync(filePath)) {
        fsSync.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
};

initializeFile(VOLUNTEERS_FILE);
initializeFile(ORGANIZERS_FILE);
initializeFile(EVENTS_FILE);
initializeFile(REGISTRATIONS_FILE);
initializeFile(NOTIFICATIONS_FILE);
initializeFile(ANNOUNCEMENTS_FILE);

// Helper functions for file operations (async)
const readData = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
};

const writeData = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing to ${filePath}:`, error);
        return false;
    }
};

// Helper function to generate unique IDs
const generateId = () => {
    return crypto.randomUUID();
};

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/signup/volunteer', async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, address, skills } = req.body;

        // Validate input
        if (!fullName || !email || !password || !phoneNumber || !address) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const volunteers = await readData(VOLUNTEERS_FILE);

        // Check if email already exists
        const existingVolunteer = volunteers.find(v => v.email === email);
        if (existingVolunteer) {
            return res.status(400).json({ error: 'This email is already registered!' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new volunteer
        const newVolunteer = {
            id: generateId(),
            role: 'volunteer',
            fullName,
            email,
            password: hashedPassword,
            phoneNumber,
            address,
            skills: skills || {}
        };

        volunteers.push(newVolunteer);
        await writeData(VOLUNTEERS_FILE, volunteers);

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

        const organizers = await readData(ORGANIZERS_FILE);

        // Check if email already exists
        const existingOrganizer = organizers.find(o => o.email === email);
        if (existingOrganizer) {
            return res.status(400).json({ error: 'This email is already registered!' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new organizer
        const newOrganizer = {
            id: generateId(),
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
        await writeData(ORGANIZERS_FILE, organizers);

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
            const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gmail.com';
            const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
            
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
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
            users = await readData(VOLUNTEERS_FILE);
        } else if (userType === 'organizer') {
            users = await readData(ORGANIZERS_FILE);
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
app.get('/api/events', async (req, res) => {
    try {
        const events = await readData(EVENTS_FILE);
        res.json(events);
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ error: 'Server error fetching events' });
    }
});

app.post('/api/events', authenticateToken, async (req, res) => {
    try {
        const { title, description, date, location, maxVolunteers, organizerId } = req.body;
        
        // Validate required fields
        if (!title || !description || !date || !location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const events = await readData(EVENTS_FILE);
        const newEvent = {
            id: generateId(),
            title,
            description,
            date,
            location,
            maxVolunteers: maxVolunteers || 0,
            organizerId: organizerId || req.user.id,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        events.push(newEvent);
        await writeData(EVENTS_FILE, events);
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Server error creating event' });
    }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
    try {
        const events = await readData(EVENTS_FILE);
        const eventId = req.params.id;
        const index = events.findIndex(e => e.id === eventId);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Only allow updating specific fields
        const { title, description, date, location, maxVolunteers, status } = req.body;
        const updates = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (date !== undefined) updates.date = date;
        if (location !== undefined) updates.location = location;
        if (maxVolunteers !== undefined) updates.maxVolunteers = maxVolunteers;
        if (status !== undefined) updates.status = status;

        events[index] = { ...events[index], ...updates, updatedAt: new Date().toISOString() };
        await writeData(EVENTS_FILE, events);
        res.json(events[index]);
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ error: 'Server error updating event' });
    }
});

// Registrations Routes
app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await readData(REGISTRATIONS_FILE);
        res.json(registrations);
    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({ error: 'Server error fetching registrations' });
    }
});

app.post('/api/registrations', authenticateToken, async (req, res) => {
    try {
        const { eventId, volunteerId, status } = req.body;
        
        // Validate required fields
        if (!eventId || !volunteerId) {
            return res.status(400).json({ error: 'eventId and volunteerId are required' });
        }

        const registrations = await readData(REGISTRATIONS_FILE);
        const newRegistration = {
            id: generateId(),
            eventId,
            volunteerId,
            status: status || 'pending',
            registeredAt: new Date().toISOString()
        };
        registrations.push(newRegistration);
        await writeData(REGISTRATIONS_FILE, registrations);
        res.status(201).json(newRegistration);
    } catch (error) {
        console.error('Create registration error:', error);
        res.status(500).json({ error: 'Server error creating registration' });
    }
});

// Notifications Routes
app.get('/api/notifications', async (req, res) => {
    try {
        const notifications = await readData(NOTIFICATIONS_FILE);
        res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Server error fetching notifications' });
    }
});

app.post('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const { userId, message, type } = req.body;
        
        // Validate required fields
        if (!userId || !message) {
            return res.status(400).json({ error: 'userId and message are required' });
        }

        const notifications = await readData(NOTIFICATIONS_FILE);
        const newNotification = {
            id: generateId(),
            userId,
            message,
            type: type || 'info',
            read: false,
            createdAt: new Date().toISOString()
        };
        notifications.push(newNotification);
        await writeData(NOTIFICATIONS_FILE, notifications);
        res.status(201).json(newNotification);
    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ error: 'Server error creating notification' });
    }
});

app.put('/api/notifications/:id', authenticateToken, async (req, res) => {
    try {
        const notifications = await readData(NOTIFICATIONS_FILE);
        const notificationId = req.params.id;
        const index = notifications.findIndex(n => n.id === notificationId);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        // Only allow updating specific fields
        const { read, message } = req.body;
        const updates = {};
        if (read !== undefined) updates.read = read;
        if (message !== undefined) updates.message = message;

        notifications[index] = { ...notifications[index], ...updates, updatedAt: new Date().toISOString() };
        await writeData(NOTIFICATIONS_FILE, notifications);
        res.json(notifications[index]);
    } catch (error) {
        console.error('Update notification error:', error);
        res.status(500).json({ error: 'Server error updating notification' });
    }
});

// Announcements Routes
app.get('/api/announcements', async (req, res) => {
    try {
        const announcements = await readData(ANNOUNCEMENTS_FILE);
        res.json(announcements);
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ error: 'Server error fetching announcements' });
    }
});

app.post('/api/announcements', authenticateToken, async (req, res) => {
    try {
        const { eventId, title, content } = req.body;
        
        // Validate required fields
        if (!eventId || !title || !content) {
            return res.status(400).json({ error: 'eventId, title, and content are required' });
        }

        const announcements = await readData(ANNOUNCEMENTS_FILE);
        const newAnnouncement = {
            id: generateId(),
            eventId,
            title,
            content,
            createdAt: new Date().toISOString()
        };
        announcements.push(newAnnouncement);
        await writeData(ANNOUNCEMENTS_FILE, announcements);
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
