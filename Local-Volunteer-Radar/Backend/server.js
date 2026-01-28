const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const loginRoutes = require('./routes/loginRoutes');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const User = require('./models/User');
const userApproveRejectRoutes = require('./routes/userApproveRejectRoutes');
const eventRoutes = require('./routes/eventRoutes');
const generalEventRoutes = require('./routes/generalEventRoutes');
const adminAnalyticsRoutes = require('./routes/adminAnalyticsRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

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
app.use('/api', generalEventRoutes);
app.use('/api/admin', userApproveRejectRoutes);
app.use('/api/admin', eventRoutes);
app.use("/api/admin", adminAnalyticsRoutes);

app.get('/', (req, res) => {
    res.json({ message: '✅ Backend is running!' });
});

// Chat API Routes
app.post('/api/conversations', async (req, res) => {
    try {
        const { conversationId, participants, eventId, eventName, lastMessage, lastMessageTime } = req.body;

        let conversation = await Conversation.findOne({ conversationId });

        if (!conversation) {
            conversation = new Conversation({
                conversationId,
                participants,
                eventId,
                eventName,
                lastMessage: lastMessage || '',
                lastMessageTime: lastMessageTime || new Date()
            });
            await conversation.save();
            console.log('✅ New conversation created:', conversationId);
        } else {
            console.log('📩 Conversation already exists:', conversationId);
        }

        res.status(200).json({
            success: true,
            conversation
        });
    } catch (error) {
        console.error('❌ Error creating conversation:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/conversations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('📋 Fetching conversations for user:', userId);

        const conversations = await Conversation.find({
            'participants.userId': userId
        }).sort({ lastMessageTime: -1 });

        console.log(`📋 Found ${conversations.length} conversations for ${userId}`);
        conversations.forEach(conv => {
            console.log(`  - ${conv.conversationId}: ${conv.lastMessage?.substring(0, 30)}...`);
        });

        res.json(conversations);
    } catch (error) {
        console.error('❌ Error fetching conversations:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/messages/:conversationId', async (req, res) => {
    try {
        const { conversationId } = req.params;
        console.log('📨 Fetching messages for conversation:', conversationId);

        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        console.log(`📨 Found ${messages.length} messages in ${conversationId}`);

        res.json(messages);
    } catch (error) {
        console.error('❌ Error fetching messages:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/messages/mark-read', async (req, res) => {
    try {
        const { conversationId, userId } = req.body;
        const result = await Message.updateMany(
            { conversationId, receiverId: userId, read: false },
            { read: true }
        );
        console.log(`✅ Marked ${result.modifiedCount} messages as read for ${userId}`);
        res.json({ success: true });
    } catch (error) {
        console.error('❌ Error marking messages as read:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/unread-count/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const count = await Message.countDocuments({
            receiverId: userId,
            read: false
        });
        console.log(`📊 Unread count for ${userId}: ${count}`);
        res.json({ count });
    } catch (error) {
        console.error('❌ Error fetching unread count:', error);
        res.status(500).json({ error: error.message });
    }
});

// Socket.IO Connection
const activeUsers = new Map(); // Track active users

io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        activeUsers.set(socket.id, userId);
        console.log(`✅ User ${userId} joined their room (socket: ${socket.id})`);
        console.log(`👥 Active users: ${Array.from(activeUsers.values()).join(', ')}`);
    });

    socket.on('send_message', async (data) => {
        try {
            console.log('\n📨 ===== NEW MESSAGE =====');
            console.log('From:', data.senderId, `(${data.senderRole})`);
            console.log('To:', data.receiverId, `(${data.receiverRole})`);
            console.log('Message:', data.message);
            console.log('Conversation:', data.conversationId);
            console.log('Event:', data.eventName || 'No event');

            const { conversationId, senderId, senderName, senderRole, receiverId, receiverName, receiverRole, eventId, eventName, message } = data;

            // Save message to database
            const newMessage = new Message({
                conversationId,
                senderId,
                senderName,
                senderRole,
                receiverId,
                receiverName,
                receiverRole,
                eventId,
                eventName,
                message,
                read: false
            });

            await newMessage.save();
            console.log('✅ Message saved to DB with ID:', newMessage._id);

            // Update or create conversation
            const updatedConversation = await Conversation.findOneAndUpdate(
                { conversationId },
                {
                    conversationId,
                    participants: [
                        { userId: senderId, userName: senderName, userRole: senderRole },
                        { userId: receiverId, userName: receiverName, userRole: receiverRole }
                    ],
                    eventId,
                    eventName,
                    lastMessage: message,
                    lastMessageTime: new Date(),
                    updatedAt: new Date()
                },
                { upsert: true, new: true }
            );
            console.log('✅ Conversation updated:', conversationId);

            // Convert to plain object to send
            const messageToSend = newMessage.toObject();

            // DON'T send back to sender - they already have optimistic update
            // Only send to receiver
            const receiverSockets = await io.in(receiverId).fetchSockets();
            console.log(`📤 Sending to receiver room (${receiverId}): ${receiverSockets.length} socket(s)`);
            io.to(receiverId).emit('receive_message', messageToSend);

            if (receiverSockets.length === 0) {
                console.log('⚠️  WARNING: Receiver is not connected! Message saved but not delivered in real-time.');
            }

            // Update unread count for receiver
            const unreadCount = await Message.countDocuments({
                receiverId,
                read: false
            });
            console.log(`📊 Unread count for ${receiverId}: ${unreadCount}`);
            io.to(receiverId).emit('unread_count_update', { count: unreadCount });

            console.log('✅ ===== MESSAGE SENT =====\n');

        } catch (error) {
            console.error('❌ Error sending message:', error);
            socket.emit('message_error', { error: error.message });
        }
    });

    socket.on('typing', (data) => {
        console.log(`⌨️  ${data.userName} is typing in ${data.conversationId}`);
        socket.to(data.receiverId).emit('user_typing', {
            conversationId: data.conversationId,
            isTyping: data.isTyping,
            userName: data.userName
        });
    });

    socket.on('disconnect', () => {
        const userId = activeUsers.get(socket.id);
        activeUsers.delete(socket.id);
        console.log(`🔌 User disconnected: ${socket.id} (userId: ${userId})`);
        console.log(`👥 Active users: ${Array.from(activeUsers.values()).join(', ')}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO ready on http://localhost:${PORT}`);
});