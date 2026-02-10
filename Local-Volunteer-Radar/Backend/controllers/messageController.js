const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    const messages = await Message.find({
        conversationId: req.params.conversationId
    }).sort({ createdAt: 1 });

    res.json(messages);
};

exports.markAsRead = async (req, res) => {
    const { conversationId, userId } = req.body;

    await Message.updateMany(
        { conversationId, receiverId: userId, read: false },
        { read: true }
    );

    res.json({ success: true });
};

exports.getUnreadCount = async (req, res) => {
    const count = await Message.countDocuments({
        receiverId: req.params.userId,
        read: false
    });

    res.json({ count });
};
