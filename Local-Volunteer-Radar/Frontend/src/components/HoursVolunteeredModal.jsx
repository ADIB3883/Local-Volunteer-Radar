import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

const HoursVolunteeredModal = () => {
    const [totalHours, setTotalHours] = useState(0);
    const [breakdown, setBreakdown] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHours();
    }, []);

    const calculateEventHours = (startTime, endTime, startdate, enddate) => {
        if (!startTime || !endTime || !startdate) return 0;
        try {
            const [startH, startM] = startTime.split(':').map(Number);
            const [endH, endM] = endTime.split(':').map(Number);
            const dailyMinutes = (endH * 60 + endM) - (startH * 60 + startM);
            if (dailyMinutes <= 0) return 0;

            // Count number of days
            const start = new Date(startdate);
            const end = new Date(enddate || startdate);
            const diffTime = end - start;
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day

            return (dailyMinutes / 60) * days;
        } catch {
            return 0;
        }
    };

    const fetchHours = async () => {
        try {
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!loggedInUser?.email) return;

            const res = await fetch(`http://localhost:5000/api/events/volunteer/${loggedInUser.email}/registrations`);
            const data = await res.json();

            if (!data.success) return;

            // Only approved registrations in completed events
            const eligible = data.registrations.filter(
                reg => reg.registrationStatus === 'approved' && reg.event.status === 'completed'
            );

            // Calculate total hours and group by month
            const monthMap = {};
            let total = 0;

            eligible.forEach(({ event }) => {
                const hours = calculateEventHours(event.startTime, event.endTime, event.startdate, event.enddate);
                total += hours;

                // Group by month using startdate
                const date = new Date(event.startdate);
                const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

                if (!monthMap[monthKey]) monthMap[monthKey] = 0;
                monthMap[monthKey] += hours;
            });

            // Sort months newest first
            const sortedBreakdown = Object.entries(monthMap)
                .map(([month, hours]) => ({ month, hours: Math.round(hours * 10) / 10 }))
                .sort((a, b) => new Date(b.month) - new Date(a.month));

            setTotalHours(Math.round(total * 10) / 10);
            setBreakdown(sortedBreakdown);
        } catch (err) {
            console.error('Error fetching hours:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading...</div>;
    }

    return (
        <div>
            {/* Summary Card */}
            <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                color: 'white',
                marginBottom: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <TrendingUp size={20} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Total Hours Contributed</span>
                </div>
                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: 0 }}>{totalHours}</p>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>Making a difference, one hour at a time</p>
            </div>

            {/* Monthly Breakdown */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
                Monthly Breakdown
            </h3>

            {breakdown.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>No hours logged yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {breakdown.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Calendar size={20} color="#6b7280" />
                                <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>{item.month}</span>
                            </div>
                            <span style={{ fontSize: '1.25rem', fontWeight: '600', color: '#10b981' }}>
                                {item.hours} hrs
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HoursVolunteeredModal;
