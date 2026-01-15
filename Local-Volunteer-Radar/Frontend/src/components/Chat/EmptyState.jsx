// src/components/chat/EmptyState.jsx

import React from 'react';
import { MessageCircle } from 'lucide-react';

const EmptyState = ({ title, description }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">{description}</p>
        </div>
    );
};

export default EmptyState;