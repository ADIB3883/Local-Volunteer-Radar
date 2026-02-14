const Conversation = require('../models/Conversation');

exports.createConversation = async (req, res) => {
    const {
        conversationId,
        participants,
        eventId,
        eventName,
        lastMessage,
        lastMessageTime
    } = req.body;

    let conversation = await Conversation.findOne({ conversationId });

    if (!conversation) {
        conversation = new Conversation({
            conversationId,
            participants,
            eventId,
            eventName,
            lastMessage: lastMessage || '',
            lastMessageTime: lastMessageTime || new Date()
        });
        await conversation.save();
    }

    res.json({ success: true, conversation });
};

exports.getUserConversations = async (req, res) => {
    const conversations = await Conversation.find({
        'participants.userId': req.params.userId
    }).sort({ lastMessageTime: -1 });

    res.json(conversations);
};
