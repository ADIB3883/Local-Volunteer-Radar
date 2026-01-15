// src/contexts/ChatContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    getConversationsForUser,
    getConversationById,
    getMessages,
    saveMessage,
    markConversationAsRead,
    createConversation,
    initializeDefaultConversations
} from '../services/mockChatData';

const ChatContext = createContext();

export const ChatProvider = ({ children, userId, userType }) => {
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState({});
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    // Initialize default conversations on first load
    useEffect(() => {
        initializeDefaultConversations();
    }, []);

    // Load conversations for current user
    useEffect(() => {
        if (!userId || !userType) return;

        const loadConversations = () => {
            const userConversations = getConversationsForUser(userId, userType);
            setConversations(userConversations);
        };

        loadConversations();

        // Listen for localStorage changes (cross-tab communication)
        const handleStorageChange = (e) => {
            if (e.key === 'chat_conversations' || e.key === 'chat_messages') {
                loadConversations();
                setLastUpdate(Date.now());
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Poll for changes every 1 second (for same-tab updates)
        const interval = setInterval(() => {
            loadConversations();
        }, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [userId, userType]);

    // Load messages when conversation changes
    useEffect(() => {
        if (currentConversation) {
            const conversationMessages = getMessages(currentConversation.id);
            setMessages(prev => ({
                ...prev,
                [currentConversation.id]: conversationMessages
            }));
        }
    }, [currentConversation, lastUpdate]);

    // Send a message
    const sendMessage = (conversationId, messageText) => {
        if (!messageText.trim()) return;

        const message = {
            senderId: userId,
            senderType: userType,
            message: messageText.trim()
        };

        const newMessage = saveMessage(conversationId, message);

        // Update local state immediately
        setMessages(prev => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), newMessage]
        }));

        // Trigger update
        setLastUpdate(Date.now());
    };

    // Mark conversation as read
    const markAsRead = (conversationId) => {
        markConversationAsRead(conversationId, userType);
        setLastUpdate(Date.now());
    };

    // Open conversation
    const openConversation = (conversationId) => {
        const conversation = getConversationById(conversationId);
        setCurrentConversation(conversation);
        markAsRead(conversationId);
    };

    // Create new conversation
    const createNewConversation = (volunteerId, organizerId, eventId, eventName) => {
        const conversation = createConversation(volunteerId, organizerId, eventId, eventName);
        setLastUpdate(Date.now());
        return conversation;
    };

    // Get unread count for user
    const getUnreadCount = () => {
        return conversations.reduce((total, conv) => {
            const count = userType === 'volunteer'
                ? conv.unreadCount.volunteer
                : conv.unreadCount.organizer;
            return total + count;
        }, 0);
    };

    const value = {
        conversations,
        currentConversation,
        messages,
        userId,
        userType,
        sendMessage,
        markAsRead,
        openConversation,
        createNewConversation,
        getUnreadCount,
        setCurrentConversation
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};