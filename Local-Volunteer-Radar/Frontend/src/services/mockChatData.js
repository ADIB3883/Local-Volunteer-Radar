// src/services/mockChatData.js

// Mock Organizers Data
export const mockOrganizers = [
    {
        id: 'org_123', // Your current organizer ID from OrganizerDashboard
        name: 'Swapno',
        avatar: '🌍',
    },
    {
        id: 'org_456',
        name: 'Food Bank Volunteers',
        avatar: '🍎',
    },
    {
        id: 'org_789',
        name: 'Animal Rescue Center',
        avatar: '🐕',
    }
];

// Mock Volunteers Data
export const mockVolunteers = [
    {
        id: 'vol_001',
        name: 'John Doe',
        avatar: '👤',
    },
    {
        id: 'vol_002',
        name: 'Sarah Smith',
        avatar: '👩',
    },
    {
        id: 'vol_003',
        name: 'Mike Johnson',
        avatar: '👨',
    },
    {
        id: 'vol_004',
        name: 'Emily Davis',
        avatar: '👧',
    }
];

// Initialize Default Conversations (only runs once)
export const initializeDefaultConversations = () => {
    const existing = localStorage.getItem('chat_conversations');
    if (existing) return; // Already initialized

    const defaultConversations = [
        // Conversation 1: Volunteer vol_001 with Organizer org_123
        {
            id: 'conv_001',
            volunteerId: 'vol_001',
            volunteerName: 'John Doe',
            volunteerAvatar: '👤',
            organizerId: 'org_123',
            organizerName: 'Swapno',
            organizerAvatar: '🌍',
            eventId: null, // Not linked to specific event yet
            eventName: 'General Inquiry',
            lastMessage: '',
            lastMessageTime: new Date().toISOString(),
            unreadCount: { volunteer: 0, organizer: 0 },
            registrationStatus: 'none', // 'registered', 'completed', 'none'
            createdAt: new Date().toISOString()
        },
        // Conversation 2: Volunteer vol_002 with Organizer org_123
        {
            id: 'conv_002',
            volunteerId: 'vol_002',
            volunteerName: 'Sarah Smith',
            volunteerAvatar: '👩',
            organizerId: 'org_123',
            organizerName: 'Swapno',
            organizerAvatar: '🌍',
            eventId: null,
            eventName: 'General Inquiry',
            lastMessage: '',
            lastMessageTime: new Date().toISOString(),
            unreadCount: { volunteer: 0, organizer: 0 },
            registrationStatus: 'registered',
            createdAt: new Date().toISOString()
        }
    ];

    localStorage.setItem('chat_conversations', JSON.stringify(defaultConversations));
    localStorage.setItem('chat_messages', JSON.stringify({})); // Empty messages object
};

// Get all conversations
export const getConversations = () => {
    const data = localStorage.getItem('chat_conversations');
    return data ? JSON.parse(data) : [];
};

// Get conversations for specific user
export const getConversationsForUser = (userId, userType) => {
    const conversations = getConversations();

    if (userType === 'volunteer') {
        return conversations.filter(conv => conv.volunteerId === userId);
    } else if (userType === 'organizer') {
        return conversations.filter(conv => conv.organizerId === userId);
    }

    return [];
};

// Get single conversation by ID
export const getConversationById = (conversationId) => {
    const conversations = getConversations();
    return conversations.find(conv => conv.id === conversationId);
};

// Get messages for a conversation
export const getMessages = (conversationId) => {
    const allMessages = localStorage.getItem('chat_messages');
    const messagesObj = allMessages ? JSON.parse(allMessages) : {};
    return messagesObj[conversationId] || [];
};

// Save a new message
export const saveMessage = (conversationId, message) => {
    // Get existing messages
    const allMessages = localStorage.getItem('chat_messages');
    const messagesObj = allMessages ? JSON.parse(allMessages) : {};

    // Add new message
    if (!messagesObj[conversationId]) {
        messagesObj[conversationId] = [];
    }

    const newMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        senderId: message.senderId,
        senderType: message.senderType, // 'volunteer' or 'organizer'
        message: message.message,
        timestamp: new Date().toISOString(),
        isRead: false
    };

    messagesObj[conversationId].push(newMessage);

    // Save messages
    localStorage.setItem('chat_messages', JSON.stringify(messagesObj));

    // Update conversation's last message
    updateConversationLastMessage(conversationId, message.message, message.senderType);

    return newMessage;
};

// Update conversation's last message and unread count
const updateConversationLastMessage = (conversationId, messageText, senderType) => {
    const conversations = getConversations();
    const updatedConversations = conversations.map(conv => {
        if (conv.id === conversationId) {
            return {
                ...conv,
                lastMessage: messageText,
                lastMessageTime: new Date().toISOString(),
                unreadCount: {
                    volunteer: senderType === 'organizer' ? conv.unreadCount.volunteer + 1 : conv.unreadCount.volunteer,
                    organizer: senderType === 'volunteer' ? conv.unreadCount.organizer + 1 : conv.unreadCount.organizer
                }
            };
        }
        return conv;
    });

    localStorage.setItem('chat_conversations', JSON.stringify(updatedConversations));
};

// Mark conversation as read
export const markConversationAsRead = (conversationId, userType) => {
    const conversations = getConversations();
    const updatedConversations = conversations.map(conv => {
        if (conv.id === conversationId) {
            return {
                ...conv,
                unreadCount: {
                    volunteer: userType === 'volunteer' ? 0 : conv.unreadCount.volunteer,
                    organizer: userType === 'organizer' ? 0 : conv.unreadCount.organizer
                }
            };
        }
        return conv;
    });

    localStorage.setItem('chat_conversations', JSON.stringify(updatedConversations));
};

// Create new conversation (when volunteer messages organizer from event card)
export const createConversation = (volunteerId, organizerId, eventId, eventName) => {
    const conversations = getConversations();

    // Check if conversation already exists
    const existing = conversations.find(
        conv => conv.volunteerId === volunteerId &&
            conv.organizerId === organizerId &&
            conv.eventId === eventId
    );

    if (existing) return existing;

    // Get volunteer and organizer info
    const volunteer = mockVolunteers.find(v => v.id === volunteerId);
    const organizer = mockOrganizers.find(o => o.id === organizerId);

    const newConversation = {
        id: `conv_${Date.now()}`,
        volunteerId,
        volunteerName: volunteer?.name || 'Volunteer',
        volunteerAvatar: volunteer?.avatar || '👤',
        organizerId,
        organizerName: organizer?.name || 'Organizer',
        organizerAvatar: organizer?.avatar || '🏢',
        eventId,
        eventName: eventName || 'Event',
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        unreadCount: { volunteer: 0, organizer: 0 },
        registrationStatus: 'registered', // Assume registered if messaging from event
        createdAt: new Date().toISOString()
    };

    conversations.push(newConversation);
    localStorage.setItem('chat_conversations', JSON.stringify(conversations));

    return newConversation;
};

// Update conversation registration status
export const updateConversationStatus = (conversationId, status) => {
    const conversations = getConversations();
    const updatedConversations = conversations.map(conv => {
        if (conv.id === conversationId) {
            return { ...conv, registrationStatus: status };
        }
        return conv;
    });

    localStorage.setItem('chat_conversations', JSON.stringify(updatedConversations));
};

// Get organizer info by ID
export const getOrganizerById = (organizerId) => {
    return mockOrganizers.find(org => org.id === organizerId);
};

// Get volunteer info by ID
export const getVolunteerById = (volunteerId) => {
    return mockVolunteers.find(vol => vol.id === volunteerId);
};