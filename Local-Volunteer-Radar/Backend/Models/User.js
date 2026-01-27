const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true }, // 'volunteer', 'organizer', 'admin'
    phoneNumber: String,
    address: String,
    skills: {
        type: Object,
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
    }
});

module.exports = mongoose.model('User', UserSchema, 'Users');