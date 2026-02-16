import { X, Mail, Phone, MapPin, Calendar, Tag, Briefcase, Trash2 } from 'lucide-react';

const PartnerModal = ({ selectedUser, onClose, initiateDelete, formatDate, getInitials, getAvatarColor, getSkillsDisplay }) => {
    if (!selectedUser) return null;

    return (
        <div 
            style={{ 
                position: 'fixed', 
                top: 0, 
                left: 0, 
                right: 0, 
                bottom: 0, 
                background: 'rgba(0, 0, 0, 0.5)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                zIndex: 50 
            }} 
            onClick={onClose}
        >
            <div 
                style={{ 
                    background: 'white', 
                    borderRadius: '1rem', 
                    padding: '2rem', 
                    maxWidth: '600px', 
                    width: '90%', 
                    maxHeight: '90vh', 
                    overflowY: 'auto', 
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)', 
                    position: 'relative' 
                }} 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    style={{ 
                        position: 'absolute', 
                        top: '1rem', 
                        right: '1rem', 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer', 
                        padding: '0.5rem', 
                        color: '#6b7280', 
                        transition: 'color 0.2s' 
                    }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                >
                    <X size={18} />
                </button>

                {/* Header with Profile */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '2px solid #f3f4f6' }}>
                    <div 
                        style={{
                            width: '6rem', 
                            height: '6rem', 
                            borderRadius: '50%',
                            background: selectedUser.profilePicture ? 'transparent' : getAvatarColor(selectedUser.name || 'User'),
                            color: 'white', 
                            fontWeight: '600', 
                            fontSize: '1.5rem',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            overflow: 'hidden',
                            objectFit: 'cover',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }}
                    >
                        {selectedUser.profilePicture ? (
                            <img src={selectedUser.profilePicture} alt={selectedUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            getInitials(selectedUser.name || 'User')
                        )}
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: '0 0 0.5rem 0' }}>
                        {selectedUser.name || 'Unnamed'}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <span 
                            style={{
                                padding: '0.375rem 0.875rem', 
                                borderRadius: '1rem', 
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                background: selectedUser.type === 'volunteer' ? '#fef3c7' :
                                    selectedUser.type === 'organizer' ? '#dbeafe' : '#f3e8ff',
                                color: selectedUser.type === 'volunteer' ? '#92400e' :
                                    selectedUser.type === 'organizer' ? '#1e40af' : '#7c2d12',
                                textTransform: 'uppercase'
                            }}
                        >
                            {selectedUser.type || 'Unknown'}
                        </span>
                        {selectedUser.organizationType && (
                            <span 
                                style={{
                                    padding: '0.375rem 0.875rem', 
                                    borderRadius: '1rem', 
                                    fontSize: '0.75rem',
                                    fontWeight: '600', 
                                    background: '#f0fdf4', 
                                    color: '#15803d',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {selectedUser.organizationType}
                            </span>
                        )}
                    </div>
                </div>

                {/* Details Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {/* Email */}
                    {selectedUser.email && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                            <Mail size={18} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '0.125rem' }} />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>Email</p>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#111827', fontWeight: '500', wordBreak: 'break-all' }}>
                                    {selectedUser.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Phone */}
                    {selectedUser.phoneNumber && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                            <Phone size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '0.125rem' }} />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>Phone</p>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>
                                    {selectedUser.phoneNumber}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Address */}
                    {selectedUser.address && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                            <MapPin size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '0.125rem' }} />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>Address</p>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>
                                    {selectedUser.address}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Join Date */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                        <Calendar size={18} style={{ color: '#8b5cf6', flexShrink: 0, marginTop: '0.125rem' }} />
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>Joined</p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>
                                {formatDate(selectedUser.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Bio (Volunteer) */}
                    {selectedUser.bio && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                            <Tag size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '0.125rem' }} />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>Bio</p>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>
                                    {selectedUser.bio}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Description (Organizer) */}
                    {selectedUser.description && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                            <Briefcase size={18} style={{ color: '#06b6d4', flexShrink: 0, marginTop: '0.125rem' }} />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>Description</p>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#111827', fontWeight: '500' }}>
                                    {selectedUser.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Skills (Volunteer) */}
                    {selectedUser.skills && Object.keys(selectedUser.skills).length > 0 && (
                        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <Tag size={18} style={{ color: '#f59e0b' }} />
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>Skills</p>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingLeft: '2rem' }}>
                                {getSkillsDisplay(selectedUser.skills).map((skill, i) => (
                                    <span 
                                        key={i} 
                                        style={{
                                            padding: '0.375rem 0.75rem', 
                                            borderRadius: '0.5rem',
                                            background: '#f0fdf4', 
                                            color: '#15803d', 
                                            fontSize: '0.75rem',
                                            fontWeight: '500', 
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        ✓ {skill.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Availability Progress (Volunteer) */}
                    {selectedUser.availability && selectedUser.availability.length > 0 && (
                        <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <Calendar size={18} style={{ color: '#8b5cf6' }} />
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>Availability</p>
                            </div>
                            <div style={{ paddingLeft: '2rem' }}>
                                <div style={{ background: '#f3f4f6', borderRadius: '0.5rem', height: '0.5rem', overflow: 'hidden' }}>
                                    <div 
                                        style={{
                                            background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                                            height: '100%',
                                            width: `${Math.min((selectedUser.availability.length * 20), 100)}%`,
                                            transition: 'width 0.3s ease'
                                        }}
                                    ></div>
                                </div>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                                    {selectedUser.availability.length} time slots available
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Button */}
                <button
                    onClick={() => initiateDelete(selectedUser._id?.$oid || selectedUser._id, selectedUser.name)}
                    style={{
                        width: '100%',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        background: '#ef4444',
                        color: '#ffffff',
                        border: 'none', 
                        borderRadius: '0.625rem',
                        cursor: 'pointer', 
                        fontWeight: '600', 
                        fontSize: '0.875rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fecaca';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fee2e2';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <Trash2 size={18} />
                    Delete User
                </button>
            </div>
        </div>
    );
};

export default PartnerModal;
