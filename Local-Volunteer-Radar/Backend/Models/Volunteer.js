const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
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
    },
    isPending: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Volunteer', VolunteerSchema, 'Volunteers');