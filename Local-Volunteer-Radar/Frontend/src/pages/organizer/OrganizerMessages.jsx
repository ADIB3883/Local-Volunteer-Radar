// src/pages/organizer/OrganizerMessages.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import ConversationItem from '../../components/chat/ConversationItem';
import EmptyState from '../../components/chat/EmptyState';

const OrganizerMessages = () => {
    const navigate = useNavigate();
    const { conversations, userType } = useChat();
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filterTabs = [
        { id: 'all', label: 'All' },
        { id: 'registered', label: 'Registered Volunteers' },
        { id: 'unregistered', label: 'Unregistered Volunteers' }
    ];

    // Filter conversations based on active tab and search
    const filteredConversations = conversations.filter(conv => {
        // Search filter
        const matchesSearch = conv.volunteerName.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        // Tab filter
        if (activeFilter === 'all') return true;
        if (activeFilter === 'registered') return conv.registrationStatus === 'registered';
        if (activeFilter === 'unregistered') return conv.registrationStatus === 'none';

        return true;
    }).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    const handleConversationClick = (conversation) => {
        navigate(`/organizer/messages/${conversation.id}`);
    };

    const getEmptyStateMessage = () => {
        if (searchQuery) {
            return {
                title: 'No conversations found',
                description: `No conversations match "${searchQuery}"`
            };
        }

        switch (activeFilter) {
            case 'registered':
                return {
                    title: 'No registered volunteers yet',
                    description: 'Volunteers who register for your events will appear here'
                };
            case 'unregistered':
                return {
                    title: 'No unregistered volunteers',
                    description: 'Volunteers who message you without registering will appear here'
                };
            default:
                return {
                    title: 'No conversations yet',
                    description: 'Start connecting with volunteers through your events'
                };
        }
    };

    const emptyState = getEmptyStateMessage();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            onClick={() => navigate('/organizer/dashboard')}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search volunteers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto">
                    <div className="flex overflow-x-auto">
                        {filterTabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveFilter(tab.id)}
                                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeFilter === tab.id
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Conversations List */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white min-h-[calc(100vh-180px)]">
                    {filteredConversations.length === 0 ? (
                        <EmptyState
                            title={emptyState.title}
                            description={emptyState.description}
                        />
                    ) : (
                        <div>
                            {filteredConversations.map(conv => (
                                <ConversationItem
                                    key={conv.id}
                                    conversation={conv}
                                    onClick={() => handleConversationClick(conv)}
                                    userType={userType}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrganizerMessages;