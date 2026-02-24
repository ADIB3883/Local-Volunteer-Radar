import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainNav from './MainNav';

const API_URL = 'https://local-volunteer-radar.onrender.com/api/events';

const Announcements = () => {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('loggedInUser'));

            if (!user || !user.id) {
                navigate('/login');
                return;
            }

            const response = await axios.get(`${API_URL}/organizer/${user.id}/announcements`);
            setAnnouncements(response.data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="min-h-screen bg-[linear-gradient(113.19deg,#FFFFFF_0%,#EEF5FE_76.1%)] p-8">
            <MainNav />
            <div className="max-w-[90%] mx-auto relative top-[90px]">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-[linear-gradient(131.73deg,#0067DD_5.55%,#00AD4B_71.83%)] rounded-xl flex items-center justify-center">
                            <svg width="25" height="25" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M16.9992 2.00312V5.26212C17.3932 5.26212 17.7833 5.33972 18.1472 5.49049C18.5112 5.64125 18.8419 5.86223 19.1205 6.1408C19.3991 6.41938 19.6201 6.7501 19.7708 7.11407C19.9216 7.47805 19.9992 7.86816 19.9992 8.26213C19.9992 8.65609 19.9216 9.0462 19.7708 9.41018C19.6201 9.77415 19.3991 10.1049 19.1205 10.3834C18.8419 10.662 18.5112 10.883 18.1472 11.0338C17.7833 11.1845 17.3932 11.2621 16.9992 11.2621V14.2621C16.9992 15.9101 15.1182 16.8511 13.7992 15.8621L11.7392 14.3161C10.638 13.4906 9.35593 12.9393 7.9992 12.7081V15.5521C7.99931 16.2059 7.76309 16.8376 7.3341 17.3309C6.9051 17.8242 6.31225 18.1458 5.66481 18.2364C5.01738 18.327 4.35902 18.1805 3.81108 17.824C3.26314 17.4674 2.86257 16.9248 2.6832 16.2961L1.1132 10.8001C0.548217 10.1329 0.180535 9.32134 0.0514852 8.45663C-0.0775649 7.59193 0.0371319 6.70836 0.382683 5.90526C0.728234 5.10216 1.29094 4.41137 2.00755 3.91052C2.72416 3.40968 3.56626 3.11864 4.4392 3.07012L7.4572 2.90212C8.93384 2.8201 10.3699 2.3886 11.6472 1.64312L13.9912 0.275125C15.3252 -0.501875 16.9992 0.459125 16.9992 2.00312ZM3.6332 12.3401L4.6062 15.7471C4.65302 15.912 4.75794 16.0544 4.90157 16.148C5.0452 16.2416 5.21785 16.2801 5.38763 16.2563C5.55741 16.2326 5.71286 16.1482 5.82527 16.0187C5.93768 15.8893 5.99946 15.7236 5.9992 15.5521V12.5421L4.4392 12.4551C4.16785 12.4388 3.89829 12.4003 3.6332 12.3401ZM14.9992 2.00312L12.6542 3.37212C11.2301 4.20384 9.64129 4.71377 7.9992 4.86612V10.6851C9.7862 10.9311 11.4872 11.6281 12.9392 12.7161L14.9992 14.2621V2.00312ZM5.9992 4.98612L4.5492 5.06612C3.87464 5.10337 3.23856 5.39215 2.76651 5.87545C2.29446 6.35875 2.02075 7.00145 1.9994 7.6767C1.97805 8.35194 2.21062 9.01065 2.6512 9.52281C3.09177 10.035 3.70834 10.3633 4.3792 10.4431L4.5492 10.4581L5.9992 10.5381V4.98612ZM16.9992 7.26212V9.26213C17.2541 9.26184 17.4992 9.16425 17.6846 8.98928C17.8699 8.81431 17.9814 8.57517 17.9964 8.32073C18.0113 8.06629 17.9285 7.81575 17.7649 7.62029C17.6013 7.42484 17.3693 7.29923 17.1162 7.26912L16.9992 7.26212Z" fill="white"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
                    </div>

                    {/* Announcements List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Loading announcements...</p>
                            </div>
                        ) : announcements.length > 0 ? (
                            announcements.map((announcement, index) => (
                                <div
                                    key={announcement._id || index}
                                    className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {announcement.title}
                                        </h3>
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                            {announcement.eventName}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 mb-3">
                                        {announcement.message}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(announcement.sentAt)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
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