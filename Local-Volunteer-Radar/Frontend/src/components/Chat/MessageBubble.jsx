// src/components/chat/MessageBubble.jsx

import React from 'react';

const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const MessageBubble = ({ message, isOwn }) => {
    return (
        <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl break-words ${
                isOwn
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-200 text-gray-900 rounded-bl-sm'
            }`}>
                <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatMessageTime(message.timestamp)}
                </p>
            </div>
        </div>
    );
};

export default MessageBubble;