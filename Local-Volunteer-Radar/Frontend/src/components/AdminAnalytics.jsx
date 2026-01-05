const LineChart = ({ data }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const points = data
        .map((v, i) => {
            const x = (i / (data.length - 1)) * 500;
            const y = 120 - ((v - min) / (max - min)) * 100;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <svg width="500" height="140">
            <polyline
                points={points}
                fill="none"
                stroke="#000"
                strokeWidth="2"
            />
            {data.map((v, i) => {
                const x = (i / (data.length - 1)) * 500;
                const y = 120 - ((v - min) / (max - min)) * 100;
                return <circle key={i} cx={x} cy={y} r="4" fill="#000" />;
            })}
        </svg>
    );
};

const AnalyticsCard = ({ title, value, data }) => (
    <div
        style={{
            width: '541px',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '1.5rem',
            background: '#f9fafb'
        }}
    >
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{title}</div>
        <div style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1rem' }}>
            {value}
        </div>
        <LineChart data={data} />
    </div>
);

export default function AdminAnalytics() {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, 541px)',
                gap: '1.5rem'
            }}
        >
            <AnalyticsCard
                title="Hours Worked (Yearly)"
                value="1,248 hrs"
                data={[120, 95, 160, 80, 140, 110, 170, 130, 150, 100, 165, 140]}
            />
            <AnalyticsCard
                title="Volunteer Enrollment (Yearly)"
                value="482"
                data={[20, 35, 40, 28, 55, 60, 75, 68, 70, 64, 80, 87]}
            />
            <AnalyticsCard
                title="NGO Enrollment (Yearly)"
                value="96"
                data={[5, 8, 12, 10, 14, 18, 20, 22, 24, 26, 28, 30]}
            />
            <AnalyticsCard
                title="Active Projects (Yearly)"
                value="38"
                data={[12, 15, 14, 18, 22, 25, 27, 30, 32, 34, 36, 38]}
            />
        </div>
    );
}