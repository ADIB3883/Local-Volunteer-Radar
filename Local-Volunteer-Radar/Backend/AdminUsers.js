const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const users = [
    {
        name: 'Buzz Osborne',
        email: 'buzz@example.com',
        password: 'password123', // You should hash this in production
        type: 'volunteer',
        phoneNumber: '+1 (555) 123-4567',
        address: '123 Main St, New York, NY 10001',
        skills: ['First-Aid', 'Distribution'],
        status: 'Active',
        hoursVolunteered: 45,
        joinedDate: new Date('2024-06-25')
    },
    {
        name: 'Lucas Harrington',
        email: 'lucas@example.com',
        password: 'password123',
        type: 'volunteer',
        phoneNumber: '+1 (555) 234-5678',
        address: '456 Oak Ave, Boston, MA 02101',
        skills: ['Education', 'Environment'],
        status: 'Inactive',
        hoursVolunteered: 32,
        joinedDate: new Date('2024-06-01')
    },
    {
        name: 'ABC Charity',
        email: 'abcch@example.com',
        password: 'password123',
        type: 'ngo',
        phoneNumber: '+1 (555) 345-6789',
        address: '789 Charity Lane, Chicago, IL 60601',
        category: 'Education',
        registrationNumber: 'NGO-2024-001',
        membersCount: 150,
        status: 'Inactive',
        joinedDate: new Date('2024-04-24')
    },
    {
        name: 'Zara Patel',
        email: 'zpatel@example.com',
        password: 'password123',
        type: 'volunteer',
        phoneNumber: '+1 (555) 456-7890',
        address: '321 Elm St, Seattle, WA 98101',
        skills: ['First-Aid', 'Education'],
        status: 'Active',
        hoursVolunteered: 78,
        joinedDate: new Date('2024-01-30')
    },
    {
        name: 'T. Park',
        email: 'theop@example.com',
        password: 'password123',
        type: 'volunteer',
        phoneNumber: '+1 (555) 567-8901',
        address: '654 Pine Rd, Austin, TX 73301',
        skills: ['Distribution', 'Environment'],
        status: 'Inactive',
        hoursVolunteered: 120,
        joinedDate: new Date('2023-12-02')
    }
];

mongoose.connect(process.env.MONGODB_URI, { dbName: 'TestingDB' })
    .then(async () => {
        console.log('✅ MongoDB connected successfully to TestingDB');

        try {
            // Optional: Clear existing users (uncomment if you want to start fresh)
            // await User.deleteMany({});
            // console.log('🗑️  Cleared existing users');

            // Insert users
            const insertedUsers = await User.insertMany(users);
            console.log(`✅ Successfully inserted ${insertedUsers.length} users`);

            insertedUsers.forEach(user => {
                console.log(`   - ${user.name} (${user.type}) - ${user.email}`);
            });

        } catch (error) {
            console.error('❌ Error inserting users:', error);
        } finally {
            await mongoose.connection.close();
            console.log('🔌 Database connection closed');
        }
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });