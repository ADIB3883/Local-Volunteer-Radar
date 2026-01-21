const mongoose = require('mongoose');
require('dotenv').config();

const Conversation = require('./models/Conversation');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { dbName: 'TestingDB' })
    .then(async () => {
        console.log('✅ MongoDB connected successfully to TestingDB');

        try {
            // Check if any conversations exist
            const conversationCount = await Conversation.countDocuments();
            console.log(`📊 Found ${conversationCount} conversation(s) in database`);

            // Create a test conversation
            const testConversation = new Conversation({
                conversationId: 'test-conv-' + Date.now(),
                participants: [{
                    userId: 'testUser1',
                    userName: 'Test User',
                    userRole: 'client'
                }],
                eventId: 'event-123',
                eventName: 'Test Event',
                lastMessage: 'This is a test message',
                lastMessageTime: new Date()
            });

            console.log('✅ Conversation model loaded successfully!');
            console.log('📝 Test conversation created:', testConversation);

            // Optional: Save to database (uncomment to actually save)
            // await testConversation.save();
            // console.log('💾 Test conversation saved to database');

        } catch (error) {
            console.error('❌ Error during conversation test:', error);
        } finally {
            // Close connection
            await mongoose.connection.close();
            console.log('🔌 Database connection closed');
        }
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });