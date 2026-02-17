import {useState} from "react";
import { CheckCircle, XCircle } from "lucide-react";

const PendingUserCard = ({
                             id,
                             name,
                             type,
                             status,
                             phone,
                             email,
                             address,
                             joiningDate,
                             description = type === 'Organizer' ? '' : undefined,
                             skills = type === 'Volunteer' ? {} : undefined,
                             profilePicture = '',
                             onApprove,
                             onReject
                         }) => {
    const [action, setAction] = useState(null);
    const [loading, setLoading] = useState(false);

    const getInitials = (userName) => userName?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'UN';
    
    const getAvatarColor = (userName) => {
        const colors = ['#f97316', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
        let hash = 0;
        for (let i = 0; i < userName.length; i++) hash = userName.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    const badgeStyles = {
        Volunteer: {
            background: '#fef3c7',
            color: '#92400e',
        },
        Organizer: {
            background: '#e9d5ff',
            color: '#6b21a8',
        }
    };

    const skillsArray = type === 'Volunteer' && skills
        ? Object.entries(skills).filter(([_, value]) => value === true).map(([key]) => key)
        : [];

    const handleApprove = async () => {
        setLoading(true);
        try {
            const userType = type.toLowerCase();
            const response = await fetch(`/api/users/approve/${userType}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errText = await response.text().catch(() => 'Unknown error');
                throw new Error(errText || `HTTP ${response.status}`);
            }

            const data = await response.json().catch(() => ({}));

            setAction('accept');
            if (onApprove) onApprove(id, name);
        } catch (error) {
            console.error('Error approving user:', error);
            alert(`Error approving user: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            const userType = type.toLowerCase();
            const response = await fetch(`/api/users/reject/${userType}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errText = await response.text().catch(() => 'Unknown error');
                throw new Error(errText || `HTTP ${response.status}`);
            }

            setAction('reject');
            if (onReject) onReject(id, name);
        } catch (error) {
            console.error('Error rejecting user:', error);
            alert(`Error rejecting user: ${error.message || error}`);
        } finally {
            setLoading(false);
        }
    };

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
                <div style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    background: profilePicture ? 'transparent' : getAvatarColor(name || 'User'),
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                    objectFit: 'cover',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '1rem'
                }}>
                    {profilePicture ? (
                        <img src={profilePicture} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        getInitials(name || 'User')
                    )}
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
                        {name}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span style={{ ...badgeStyles[type], padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem' }}>
              {type}
            </span>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                <div><strong>Phone:</strong> {phone}</div>
                <div><strong>Email:</strong> {email}</div>
                <div><strong>Address:</strong> {address}</div>
                <div><strong>Joined:</strong> {joiningDate}</div>
            </div>

            {/* Divider */}
            <hr style={{ margin: '1rem 0', borderColor: '#e5e7eb' }} />

            {/* Skills (only for Volunteers) */}
            {type === 'Volunteer' && skillsArray.length > 0 && (
                <div>
                    <strong style={{ fontSize: '0.875rem' }}>Skills:</strong>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        {skillsArray.map((skill, i) => (
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
                        ))}
                    </div>
                </div>
            )}

            {/* Description (only for Organizers) */}
            {type === 'Organizer' && (
                <div>
                    <strong style={{ fontSize: '0.875rem' }}>Description:</strong>
                    <p style={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        marginTop: '0.85rem',
                        lineHeight: 1.5
                    }}>
                        {description}
                    </p>
                </div>
            )}

            {/* Accept/Reject */}
            <div
                style={{
                    display: 'flex',
                    gap: '0.75rem',
                    marginTop: '1rem',
                }}
            >
                {(action === null || action === 'accept') && (
                    <button
                        onClick={handleApprove}
                        disabled={loading}
                        style={{
                            flex: action === 'accept' ? 2 : 1,
                            padding: '0.6rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            background: '#22c55e',
                            color: '#ffffff',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            opacity: loading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <CheckCircle size={18} />
                        {action === 'accept' ? 'Accepted!' : loading ? 'Processing...' : 'Accept'}
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
                            background: '#ef4444',
                            color: '#ffffff',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            opacity: loading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <XCircle size={18} />
                        {action === 'reject' ? 'Rejected!' : loading ? 'Processing...' : 'Reject'}
                    </button>
                )}
            </div></div>
    );
};

export default PendingUserCard;
