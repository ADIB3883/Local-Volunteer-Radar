// src/components/chat/ConversationItem.jsx

import React, { useState, useEffect } from 'react';

// Dynamic timestamp that updates every minute
const useDynamicTimestamp = (dateString) => {
    const [timestamp, setTimestamp] = useState('');

    useEffect(() => {
        const updateTimestamp = () => {
            const date = new Date(dateString);
            const now = new Date();
            const diff = now - date;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 1) {
                setTimestamp('Just now');
            } else if (minutes < 60) {
                setTimestamp(`${minutes}m ago`);
            } else if (hours < 24) {
                setTimestamp(`${hours}h ago`);
            } else if (days === 1) {
                setTimestamp('Yesterday');
            } else if (days < 7) {
                setTimestamp(`${days}d ago`);
            } else {
                setTimestamp(date.toLocaleDateString());
            }
        };

        updateTimestamp();
        const interval = setInterval(updateTimestamp, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [dateString]);

    return timestamp;
};

const ConversationItem = ({ conversation, onClick, userType }) => {
    const isVolunteer = userType === 'volunteer';
    const avatar = isVolunteer ? conversation.organizerAvatar : conversation.volunteerAvatar;
    const name = isVolunteer ? conversation.organizerName : conversation.volunteerName;
    const eventInfo = conversation.eventName;
    const unreadCount = isVolunteer
        ? conversation.unreadCount.volunteer
        : conversation.unreadCount.organizer;

    const timestamp = useDynamicTimestamp(conversation.lastMessageTime);

    // Show placeholder if no messages yet
    const displayMessage = conversation.lastMessage || `Say hi to ${name}`;

    return (
        <div
            onClick={onClick}
            className="flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
        >
            {/* Avatar */}
            <div className="text-3xl flex-shrink-0 mt-1">{avatar}</div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
            {timestamp}
          </span>
                </div>

                <div className="text-sm text-gray-600 mb-1 truncate">{eventInfo}</div>

                <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${!conversation.lastMessage ? 'text-gray-400 italic' : 'text-gray-500'}`}>
                        {displayMessage}
                    </p>
                    {unreadCount > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 flex-shrink-0 min-w-[20px] text-center">
              {unreadCount}
            </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConversationItem;