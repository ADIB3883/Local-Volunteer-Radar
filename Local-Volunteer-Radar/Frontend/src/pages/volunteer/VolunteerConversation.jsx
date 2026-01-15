// javascript
// Local-Volunteer-Radar/Frontend/src/pages/volunteer/VolunteerConversation.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, MoreVertical } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import MessageBubble from '../../components/chat/MessageBubble';

const VolunteerConversation = () => {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { messages, sendMessage, openConversation, currentConversation, userId } = useChat();
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (conversationId) {
            openConversation(conversationId);
        }
    }, [conversationId, openConversation]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, conversationId]);

    if (!currentConversation) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Loading conversation...</p>
            </div>
        );
    }

    const conversationMessages = (messages && messages[conversationId]) || [];
    const contactName = currentConversation.organizerName;
    const contactAvatar = currentConversation.organizerAvatar;

    const handleSend = () => {
        if (inputMessage.trim()) {
            sendMessage(conversationId, inputMessage);
            setInputMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <button
                        onClick={() => navigate('/volunteer/messages')}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="text-2xl">{contactAvatar}</div>
                    <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-gray-900 truncate">{contactName}</h2>
                        <p className="text-sm text-gray-600 truncate">{currentConversation.eventName}</p>
                    </div>
                    <button className="text-gray-600 hover:text-gray-900 transition-colors">
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto bg-gray-50"
            >
                <div className="max-w-4xl mx-auto px-4 py-4">
                    {conversationMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400 italic text-sm">
                            <p>Say hi to {contactName}</p>
                        </div>
                    ) : null}
                    {conversationMessages.map(msg => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwn={msg.senderId === userId}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
                <div className="max-w-4xl mx-auto flex items-end gap-2">
                    <textarea
                        placeholder="Type a message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32 overflow-y-auto"
                        style={{ minHeight: '40px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputMessage.trim()}
                        className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VolunteerConversation;
