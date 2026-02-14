const mongoose = require('mongoose');

const OrganizerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: String,
    type: { type: String},
    address: String,
    organizationType: String,
    description: {
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

module.exports = mongoose.model('Organizer', OrganizerSchema, 'Organizers');
