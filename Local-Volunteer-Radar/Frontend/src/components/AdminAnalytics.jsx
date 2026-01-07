import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import AdminChart from './AdminChart.jsx';

const getTrendInfo = (statement) => {
    if (statement.includes('Unchanged')) {
        return { color: '#3b82f6', icon: Minus, bg: '#dbeafe' };
    } else if (statement.includes('-') || statement.toLowerCase().includes('decrease')) {
        return { color: '#ef4444', icon: TrendingDown, bg: '#fee2e2' };
    } else {
        return { color: '#10b981', icon: TrendingUp, bg: '#d1fae5' };
    }
};

const AnalyticsCard = ({ title, value, statement = '', data }) => {

    //coded to be negative
    const trend = getTrendInfo(statement);
    const Icon = trend.icon;

    return (
    <div
        style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s',
            borderLeft: `4px solid ${trend.color}`,
            width: '620px'
        }}
        onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}
        onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
    >
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{title}</div>
        <div style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.1rem' }}>
            {value}
        </div>
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: trend.color,
                fontWeight: 500,
            }}
        >
            <Icon size={16} />
            <span>{statement}</span>
        </div>

        <AdminChart data={data} />
    </div>
)};

export default function AdminAnalytics() {
    const analyticsData = [
        {
            id: 1,
            title: "Hours Worked (Yearly)",
            value: "1,248 hrs",
            statement: "26% Increase",
            data: [120, 95, 160, 80, 140, 110, 170, 130, 150, 100, 165, 140]
        },
        {
            id: 2,
            title: "Volunteer Enrollment (Yearly)",
            value: "482",
            statement: "5% Decrease",
            data: [20, 35, 40, 28, 55, 60, 75, 68, 70, 64, 80, 87]
        },
        {
            id: 3,
            title: "NGO Enrollment (Yearly)",
            value: "96",
            statement: "Unchanged",
            data: [5, 8, 12, 10, 14, 18, 20, 22, 24, 26, 28, 30]
        },
        {
            id: 4,
            title: "Active Projects (Yearly)",
            value: "38",
            statement: "1% Increase",
            data: [12, 15, 14, 18, 22, 25, 27, 30, 32, 34, 36, 38]
        }
    ];

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                gap: '1.5rem'
            }}
        >
            {analyticsData.map((item) => (
                <AnalyticsCard
                    key={item.id}
                    title={item.title}
                    value={item.value}
                    statement={item.statement}
                    data={item.data}
                />
            ))}
        </div>
    );
}