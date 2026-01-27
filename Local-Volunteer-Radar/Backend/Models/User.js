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
    hoursVolunteered: {
        type: Number,
        default: 0
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },

    // NGO-specific fields, optional
    category: String,
    registrationNumber: String,
    membersCount: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    profileImage: {
        data: { type: Buffer },
        contentType: { type: String }
    },
});

module.exports = mongoose.model('User', UserSchema, 'Users');