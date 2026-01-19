const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        unique: true
    },
    participants: [{
        userId: String,
        userName: String,
        userRole: String
    }],
    eventId: {
        type: String,
        default: null
    },
    eventName: {
        type: String,
        default: null
    },
    lastMessage: {
        type: String,
        default: ''
    },
    lastMessageTime: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Conversation', conversationSchema);