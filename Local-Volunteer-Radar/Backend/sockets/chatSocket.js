const Message = require('../Models/Message');
const Conversation = require('../Models/Conversation');

module.exports = (io) => {
    const activeUsers = new Map();

    io.on('connection', (socket) => {

        socket.on('join', (userId) => {
            socket.join(userId);
            activeUsers.set(socket.id, userId);
            console.log(`✅ User joined room: ${userId}`);
        });

        socket.on('send_message', async (data) => {
            try {
                // Save message to DB
                const newMessage = new Message({ ...data, read: false });
                await newMessage.save();

                // Upsert conversation with latest message info
                await Conversation.findOneAndUpdate(
                    { conversationId: data.conversationId },
                    {
                        conversationId: data.conversationId,
                        participants: [
                            { userId: data.senderId, userName: data.senderName, userRole: data.senderRole },
                            { userId: data.receiverId, userName: data.receiverName, userRole: data.receiverRole }
                        ],
                        eventId: data.eventId || null,
                        eventName: data.eventName || null,
                        lastMessage: data.message,
                        lastMessageTime: new Date(),
                        updatedAt: new Date()
                    },
                    { upsert: true, new: true }
                );

                // Convert to plain object so _id is serializable
                const messageObj = newMessage.toObject();
                messageObj._id = messageObj._id.toString();

                // Emit to receiver
                io.to(data.receiverId).emit('receive_message', messageObj);

                // Emit back to sender so their UI confirms the real saved message
                // (replaces the optimistic temp message in ChatInterface)
                io.to(data.senderId).emit('receive_message', messageObj);

                // Update unread count for the receiver
                const unreadCount = await Message.countDocuments({
                    receiverId: data.receiverId,
                    read: false
                });
                io.to(data.receiverId).emit('unread_count_update', { count: unreadCount });

            } catch (error) {
                console.error('❌ Error saving message:', error);
            }
        });

        socket.on('typing', (data) => {
            // Forward typing indicator to the other participant only
            socket.to(data.receiverId).emit('user_typing', {
                conversationId: data.conversationId,
                isTyping: data.isTyping,
                userName: data.userName
            });
        });

        socket.on('disconnect', () => {
            activeUsers.delete(socket.id);
        });
    });
};
