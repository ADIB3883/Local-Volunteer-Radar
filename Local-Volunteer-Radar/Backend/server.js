const dns = require('node:dns').promises;
dns.setServers(["1.1.1.1"]); // Cloudflare DNS
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const cron = require('node-cron');
const Event = require('./Models/Event');

require('dotenv').config();

const loginRoutes = require('./Routes/loginRoutes');
const signupRoutes = require('./Routes/signupRoutes');
const VolunteerProfileRoutes = require('./Routes/VolunteerProfileRoutes');
const OrganizerRoutes = require('./Routes/OrganizerRoutes');
const conversationRoutes = require('./Routes/conversationRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const userApproveRejectRoutes = require('./Routes/userApproveRejectRoutes');
const adminAnalyticsRoutes = require('./Routes/adminAnalyticsRoutes');
const User = require('./Models/User');
const eventRoutes = require("./Routes/eventRoutes");
const forgotPasswordRoutes = require('./Routes/forgotPasswordRoutes');
const googleAuthRoutes = require('./Routes/googleAuthRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
require('./sockets/chatSocket')(io);  // adjust path if your file is in a subfolder e.g. './socket/socketHandler'

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

mongoose.connect(process.env.MONGODB_URI, { dbName: 'TestingDB' })
    .then(async () => {
        console.log('✅ MongoDB connected successfully to TestingDB');

        try {
            const adminExists = await User.findOne({ type: 'admin' });
            if (!adminExists) {
                const admin = new User({
                    name: 'Admin',
                    email: 'admin@volunteer.com',
                    password: 'admin123',
                    type: 'admin'
                });
                await admin.save();
                console.log('🔐 Default admin created:');
                console.log('   Email: admin@volunteer.com');
                console.log('   Password: admin123');
            } else {
                console.log('🔐 Admin credentials:');
                console.log('   Email:', adminExists.email);
                console.log('   Password:', adminExists.password);
            }
        } catch (error) {
            console.error('❌ Error checking/creating admin:', error);
        }

        cron.schedule('*/15 * * * *', async () => {
            try {
                const now = new Date();
                const todayDate = now.toISOString().split('T')[0];       // "2026-02-17"
                const currentTime = now.toTimeString().slice(0, 5);      // "14:30"

                const result = await Event.updateMany(
                    {
                        status: 'active',
                        $or: [
                            // End date is in the past
                            { enddate: { $lt: todayDate } },
                            // End date is today AND end time has passed
                            {
                                enddate: todayDate,
                                endTime: { $lte: currentTime }
                            }
                        ]
                    },
                    {
                        $set: {
                            status: 'completed',
                            isCompleted: true,
                            completedAt: now
                        }
                    }
                );

                if (result.modifiedCount > 0) {
                    console.log(`✅ Auto-completed ${result.modifiedCount} expired event(s)`);
                }
            } catch (error) {
                console.error('❌ Cron job error:', error);
            }
        });

        console.log('Event auto-complete cron job started');

    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));



app.use('/api/users', userApproveRejectRoutes);
app.use('/api/admin/events', eventRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', loginRoutes);
app.use('/api', signupRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use('/api/organizers', OrganizerRoutes);
app.use('/api', VolunteerProfileRoutes);
app.use('/api/forgot-password', forgotPasswordRoutes);
app.use('/auth', googleAuthRoutes);


const Message = require('./Models/Message');
app.get('/api/unread-count/:userId', async (req, res) => {
    try {
        const count = await Message.countDocuments({
            receiverId: req.params.userId,
            read: false
        });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ count: 0 });
    }
});

// existing below...
app.get('/', (req, res) => {
    res.json({ message: '✅ Backend is running!' });
});

app.get('/', (req, res) => {
    res.json({ message: '✅ Backend is running!' });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO ready on http://localhost:${PORT}`);
});