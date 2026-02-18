const Message = require('../Models/Message');

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { conversationId, userId } = req.body;

        await Message.updateMany(
            { conversationId, receiverId: userId, read: false },
            { read: true }
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error marking as read:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Message.countDocuments({
            receiverId: req.params.userId,
            read: false
        });

        res.json({ count });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
