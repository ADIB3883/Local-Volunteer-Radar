import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import AdminChart from "./AdminChart.jsx";

const getTrendInfo = (statement) => {
    if (statement.includes("Unchanged")) {
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

export default function AdminAnalytics() {
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        fetch("/api/admin/analytics")
            .then(res => res.json())
            .then(data => setAnalyticsData(data))
            .catch(err => console.error("Error fetching analytics:", err));
    }, []);

    if (!analyticsData) return null;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "1.5rem" }}>
            <AnalyticsCard
                title="Hours Worked (Yearly)"
                value={`${analyticsData.analytics.hoursWorked.reduce((a, b) => a + b, 0)} hrs`}
                statement={analyticsData.trendStatement.hoursWorked}
                data={analyticsData.analytics.hoursWorked}
            />
            <AnalyticsCard
                title="Volunteer Enrollment (Yearly)"
                value={analyticsData.analytics.volunteers.reduce((a, b) => a + b, 0)}
                statement={analyticsData.trendStatement.volunteers}
                data={analyticsData.analytics.volunteers}
            />
            <AnalyticsCard
                title="NGO Enrollment (Yearly)"
                value={analyticsData.analytics.ngos.reduce((a, b) => a + b, 0)}
                statement={analyticsData.trendStatement.ngos}
                data={analyticsData.analytics.ngos}
            />
            <AnalyticsCard
                title="Active Events (Yearly)"
                value={analyticsData.analytics.activeEvents.reduce((a, b) => a + b, 0)}
                statement={analyticsData.trendStatement.activeEvents}
                data={analyticsData.analytics.activeEvents}
            />
        </div>
    );
}