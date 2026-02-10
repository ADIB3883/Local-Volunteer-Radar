const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI, { dbName: 'TestingDB' })
    .then(async () => {
        console.log('✅ MongoDB connected successfully to TestingDB');

        try {
            console.log('📄 User schema loaded successfully');
        } catch (error) {
            console.error('❌ Error:', error);
        } finally {
            await mongoose.connection.close();
            console.log('🔌 Database connection closed');
        }
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });