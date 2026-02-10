import { useState } from "react";

const PendingUserCard = ({
                             user,
                             onActionComplete
                         }) => {
    const [action, setAction] = useState(null);
    const [loading, setLoading] = useState(false);

    const badgeStyles = {
        volunteer: {
            background: '#fef3c7',
            color: '#92400e',
        },
        ngo: {
            background: '#e9d5ff',
            color: '#6b21a8',
        },
        organizer: {
            background: '#dbeafe',
            color: '#1e40af',
        }
    };

    const handleApprove = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/admin/users/approve/${user.id}`,
                { method: "PUT", headers: { "Content-Type": "application/json" } }
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText.slice(0, 100));
            }

            const data = await res.json();
            setAction("approve");
            onActionComplete?.();
        } catch (err) {
            alert(err.message || "Failed to approve user");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/admin/users/reject/${user.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({})
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText.slice(0, 100));
            }

            const data = await res.json();
            setAction("reject");
            onActionComplete?.();
        } catch (err) {
            alert(err.message || "Failed to reject user");
        } finally {
            setLoading(false);
        }
    };

    // Convert buffer to image URL if exists
    const getProfileImage = () => {
        if (user.profileImage?.data) {
            const base64 = btoa(
                new Uint8Array(user.profileImage.data.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                )
            );
            return `data:${user.profileImage.contentType};base64,${base64}`;
        }
        return '/default-avatar.png';
    };

    // Format skills based on whether it's object or array
    const getSkills = () => {
        if (!user.skills) return [];
        if (Array.isArray(user.skills)) return user.skills;
        if (typeof user.skills === 'object') {
            return Object.values(user.skills).flat();
        }
        return [];
    };

    const skills = getSkills();

    return (
        <div
            style={{
                width: '410px',
                background: '#fff',
                borderRadius: '1rem',
                padding: '1.25rem',
                boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
                border: '1px solid #e5e7eb',
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <img
                    src={getProfileImage()}
                    alt={user.name}
                    style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                    }}
                />

                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
                        {user.name}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <span style={{
                            ...badgeStyles[user.type],
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            textTransform: 'capitalize'
                        }}>
                            {user.type.toUpperCase()}
                        </span>
                        {user.type === 'ngo' && user.category && (
                            <span style={{
                                background: '#fce7f3',
                                color: '#9f1239',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '999px',
                                fontSize: '0.75rem'
                            }}>
                                {user.category}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Info */}
            <div style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                <div><strong>Phone:</strong> {user.phoneNumber || 'N/A'}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Address:</strong> {user.address || 'N/A'}</div>
                <div><strong>Joined:</strong> {new Date(user.joinedDate || user.createdAt).toLocaleDateString()}</div>

                {/* NGO-specific fields */}
                {user.type === 'ngo' && (
                    <>
                        {user.registrationNumber && (
                            <div><strong>Registration:</strong> {user.registrationNumber}</div>
                        )}
                        {user.membersCount > 0 && (
                            <div><strong>Members:</strong> {user.membersCount}</div>
                        )}
                    </>
                )}

                {/* Volunteer-specific fields */}
                {user.type === 'volunteer' && user.hoursVolunteered > 0 && (
                    <div><strong>Hours Volunteered:</strong> {user.hoursVolunteered}</div>
                )}
            </div>

            {/* Divider */}
            <hr style={{ margin: '1rem 0', borderColor: '#e5e7eb' }} />
            {/* Skills */}
            <div>
                <strong style={{ fontSize: '0.875rem' }}>Skills:</strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {skills.length > 0 ? (
                        skills.map((skill, i) => (
                            <span
                                key={i}
                                style={{
                                    background: '#f3f4f6',
                                    color: '#111827',
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.75rem',
                                }}
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>No skills listed</span>
                    )}
                </div>
            </div>

            {/* Accept/Reject */}
            <div
                style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginTop: '1rem',
                }}
            >
                {(action === null || action === 'approve') && (
                    <button
                        onClick={handleApprove}
                        disabled={loading}
                        style={{
                            flex: action === 'approve' ? 2 : 1,
                            padding: '0.6rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            background: loading ? '#86efac' : '#22c55e',
                            color: '#ffffff',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading && action !== 'reject' ? 'Processing...' : action === 'approve' ? 'Approved!' : 'Accept'}
                    </button>
                )}

                {(action === null || action === 'reject') && (
                    <button
                        onClick={handleReject}
                        disabled={loading}
                        style={{
                            flex: action === 'reject' ? 2 : 1,
                            padding: '0.6rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            background: loading ? '#fca5a5' : '#ef4444',
                            color: '#ffffff',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading && action !== 'approve' ? 'Processing...' : action === 'reject' ? 'Rejected!' : 'Reject'}
                    </button>
                )}
            </div>
        </div>
    );
};
export default PendingUserCard;