const Conversation = require('../Models/Conversation');

exports.createConversation = async (req, res) => {
    try {
        const {
            conversationId,
            participants,
            eventId,
            eventName,
            lastMessage,
            lastMessageTime
        } = req.body;

        if (!conversationId || !participants || participants.length < 2) {
            return res.status(400).json({ success: false, message: 'conversationId and 2 participants are required.' });
        }

        let conversation = await Conversation.findOne({ conversationId });

        if (!conversation) {
            conversation = new Conversation({
                conversationId,
                participants,
                eventId: eventId || null,
                eventName: eventName || null,
                lastMessage: lastMessage || '',
                lastMessageTime: lastMessageTime || new Date(),
                updatedAt: new Date()
            });
            await conversation.save();
        }

        res.json({ success: true, conversation });
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getUserConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            'participants.userId': req.params.userId
        }).sort({ lastMessageTime: -1 });

        res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
