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
    bio: {
        type: String,
        default: ''
    },
    availability: {
        type: Array,
        default: []
    },
    profilePicture: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    hoursVolunteered: {
        type: Number,
        default: 0
    },
    isApproved: {
        type: Boolean,
        default: false
    },

    // NGO-specific fields, optional
    category: String,
    registrationNumber: String,
    membersCount: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('User', UserSchema, 'Users');