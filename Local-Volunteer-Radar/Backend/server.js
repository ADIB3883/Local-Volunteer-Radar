const dns = require('node:dns').promises;
dns.setServers(["1.1.1.1"]); // Cloudflare DNS
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const loginRoutes = require('./routes/loginRoutes');
const signupRoutes = require('./routes/signupRoutes');
const VolunteerProfileRoutes = require('./routes/VolunteerProfileRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api', loginRoutes);
app.use('/api', signupRoutes);
app.use('/api', VolunteerProfileRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
require('./sockets/chatSocket')(io);

app.get('/', (req, res) => {
    res.json({ message: '✅ Backend is running!' });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO ready on http://localhost:${PORT}`);
});