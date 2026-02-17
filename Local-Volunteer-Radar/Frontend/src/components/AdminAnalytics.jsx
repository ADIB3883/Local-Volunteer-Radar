import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import AdminChart from "./AdminChart.jsx";

const getTrendInfo = (statement) => {
    if (!statement) return { color: "#9ca3af", icon: Minus, bg: "#f3f4f6" };
    if (statement.toLowerCase().includes("unavailable")) {
        return { color: "#9ca3af", icon: Minus, bg: "#f3f4f6" };
    }
    if (statement.toLowerCase().includes("no change") || statement.toLowerCase().includes("unchanged")) {
        return { color: "#3b82f6", icon: Minus, bg: "#dbeafe" };
    } else if (statement.includes("-") || statement.toLowerCase().includes("decrease")) {
        return { color: "#ef4444", icon: TrendingDown, bg: "#fee2e2" };
    } else {
        return { color: "#10b981", icon: TrendingUp, bg: "#d1fae5" };
    }
};

const AnalyticsCard = ({ title, value, statement, data }) => {
    const trend = getTrendInfo(statement);
    const Icon = trend.icon;

    return (
        <div
            style={{
                background: "white",
                borderRadius: "1rem",
                padding: "1.5rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                transition: "box-shadow 0.3s",
                borderLeft: `4px solid ${trend.color}`,
                width: "620px"
            }}
            onMouseOver={(e) =>
                (e.currentTarget.style.boxShadow =
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1)")
            }
            onMouseOut={(e) =>
                (e.currentTarget.style.boxShadow =
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1)")
            }
        >
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>{title}</div>
            <div style={{ fontSize: "2rem", fontWeight: 600 }}>{value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: trend.color }}>
                <Icon size={16} />
                <span>{statement}</span>
            </div>
            <AdminChart data={data} />
        </div>
    );
};

const LoadingSpinner = ({ message = "Loading..." }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        color: '#6b7280'
    }}>
        <Loader2 size={32} className="animate-spin mb-4" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ margin: 0, fontSize: '1rem', fontWeight: '500' }}>{message}</p>
    </div>
);

export default function AdminAnalytics({ analytics }) {
    if (!analytics) {
        return <LoadingSpinner message="Loading analytics..." />;
    }

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "1.5rem" }}>
            <AnalyticsCard
                title="Hours Worked (Yearly)"
                value={`${analytics.analytics.hoursWorked.reduce((a, b) => a + b, 0)} hrs`}
                statement={analytics.trendStatement.hoursWorked}
                data={analytics.analytics.hoursWorked}
            />
            <AnalyticsCard
                title="Volunteer Enrollment (Yearly)"
                value={analytics.analytics.volunteers.reduce((a, b) => a + b, 0)}
                statement={analytics.trendStatement.volunteers}
                data={analytics.analytics.volunteers}
            />
            <AnalyticsCard
                title="Organizer Enrollment (Yearly)"
                value={analytics.analytics.organizer.reduce((a, b) => a + b, 0)}
                statement={analytics.trendStatement.organizer}
                data={analytics.analytics.organizer}
            />
            <AnalyticsCard
                title="Active Events (Yearly)"
                value={analytics.analytics.activeEvents.reduce((a, b) => a + b, 0)}
                statement={analytics.trendStatement.activeEvents}
                data={analytics.analytics.activeEvents}
            />
        </div>
    );
}
