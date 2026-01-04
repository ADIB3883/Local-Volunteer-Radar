import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import MainNav from './MainNav';


const Announcements = () => {
    const [announcements] = useState([
        {
            id: 1,
            title: 'Relief Distribution',
            message: 'Volunteer capacity increased to 10',
            timestamp: 'Dec 23, 06:34 PM'
        }
        // Add more announcements as needed
    ]);

    return (



        <div className="min-h-screen bg-[linear-gradient(113.19deg,#FFFFFF_0%,#EEF5FE_76.1%)] p-8">
            <MainNav></MainNav>
            <div className="max-w-4xl mx-auto relative top-[90px]">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Megaphone className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
                    </div>

                    {/* Announcements List */}
                    <div className="space-y-4">
                        {announcements.length > 0 ? (
                            announcements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:shadow-sm transition-shadow"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {announcement.title}
                                    </h3>
                                    <p className="text-gray-700 mb-3">
                                        {announcement.message}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {announcement.timestamp}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Megaphone className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500">No announcements yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>


    );
};

export default Announcements;