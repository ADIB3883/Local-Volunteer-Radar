const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true }, // 'volunteer', 'ngo', 'organizer', 'admin'
    phoneNumber: String,
    address: String,
    skills: {
        type: mongoose.Schema.Types.Mixed, // Accepts both Object and Array
        default: {}
    },

    // New optional fields - won't break existing data
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    hoursVolunteered: {
        type: Number,
        default: 0
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },

    // NGO-specific fields - all optional
    category: String,
    registrationNumber: String,
    membersCount: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema, 'Users');