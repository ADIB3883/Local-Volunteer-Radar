import {useState} from "react";

const PendingUserCard = ({
                      profilePic,
                      name,
                      type,          // "Volunteer" | "NGO"
                      status,        // "Active" | "Inactive"
                      phone,
                      email,
                      address,
                      joiningDate,
                      skills = []
                  }) => {
    const [action, setAction] = useState(null);

    const badgeStyles = {
        Volunteer: {
            background: '#fef3c7',
            color: '#92400e',
        },
        NGO: {
            background: '#e9d5ff',
            color: '#6b21a8',
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
                <img
                    src={profilePic}
                    alt={name}
                    style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                    }}
                />

                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
                        {name}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span style={{ ...badgeStyles[type], padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem' }}>
              {type}
            </span>
                        <span style={{ ...badgeStyles[status], padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem' }}>
              {status}
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

            {/* Skills */}
            <div>
                <strong style={{ fontSize: '0.875rem' }}>Skills:</strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {skills.map((skill, i) => (
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
                        onClick={() => setAction('accept')}
                        style={{
                            flex: action === 'accept' ? 2 : 1,
                            padding: '0.6rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            background: '#22c55e',
                            color: '#ffffff',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {action === 'accept' ? 'Accepted!' : 'Accept'}
                    </button>
                )}

                {(action === null || action === 'reject') && (
                    <button
                        onClick={() => setAction('reject')}
                        style={{
                            flex: action === 'reject' ? 2 : 1,
                            padding: '0.6rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            cursor: 'pointer',
                            background: '#ef4444',
                            color: '#ffffff',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {action === 'reject' ? 'Rejected!' : 'Reject'}
                    </button>
                )}
            </div>

        </div>
    );
};

export default PendingUserCard;