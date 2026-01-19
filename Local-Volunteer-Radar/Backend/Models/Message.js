const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        index: true
    },
    senderId: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    senderRole: {
        type: String,
        enum: ['volunteer', 'organizer'],
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    receiverName: {
        type: String,
        required: true
    },
    receiverRole: {
        type: String,
        enum: ['volunteer', 'organizer'],
        required: true
    },
    eventId: {
        type: String,
        default: null
    },
    eventName: {
        type: String,
        default: null
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

messageSchema.index({ conversationId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);