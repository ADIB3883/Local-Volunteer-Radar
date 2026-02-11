const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

module.exports = (io) => {
    const activeUsers = new Map();

    io.on('connection', (socket) => {

        socket.on('join', (userId) => {
            socket.join(userId);
            activeUsers.set(socket.id, userId);
        });

        socket.on('send_message', async (data) => {
            const newMessage = new Message({ ...data, read: false });
            await newMessage.save();

            await Conversation.findOneAndUpdate(
                { conversationId: data.conversationId },
                {
                    conversationId: data.conversationId,
                    participants: [
                        { userId: data.senderId, userName: data.senderName, userRole: data.senderRole },
                        { userId: data.receiverId, userName: data.receiverName, userRole: data.receiverRole }
                    ],
                    eventId: data.eventId,
                    eventName: data.eventName,
                    lastMessage: data.message,
                    lastMessageTime: new Date()
                },
                { upsert: true }
            );

            io.to(data.receiverId).emit('receive_message', newMessage);
        });

        socket.on('disconnect', () => {
            activeUsers.delete(socket.id);
        });
    });
};
