const AdminChart = ({ data }) => {
    const width = "100%";
    const height = 160;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const viewBoxWidth = 610;
    const viewBoxHeight = 160;
    const chartWidth = viewBoxWidth - padding.left - padding.right;
    const chartHeight = viewBoxHeight - padding.top - padding.bottom;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    // Generate last 12 months dynamically
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(d.toLocaleString("default", { month: "short" }));
    }

    const getX = (i) => padding.left + (i / (data.length - 1)) * chartWidth;
    const getY = (v) => padding.top + chartHeight - ((v - min) / range) * chartHeight;

    const points = data.map((v, i) => `${getX(i)},${getY(v)}`).join(" ");

    return (
        <svg width={width} height={height} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
            <line
                x1={padding.left}
                y1={padding.top + chartHeight}
                x2={padding.left + chartWidth}
                y2={padding.top + chartHeight}
                stroke="#9ca3af"
            />
            <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={padding.top + chartHeight}
                stroke="#9ca3af"
            />

            {[0, 0.5, 1].map((t, i) => {
                const value = min + t * range;
                const y = getY(value);
                return (
                    <g key={i}>
                        <line x1={padding.left - 5} y1={y} x2={padding.left} y2={y} stroke="#9ca3af" />
                        <text x={padding.left - 8} y={y + 4} fontSize="10" textAnchor="end" fill="#6b7280">
                            {value.toFixed(0)}
                        </text>
                    </g>
                );
            })}

            {data.map((_, i) => (
                <text key={i} x={getX(i)} y={height - 10} fontSize="10" textAnchor="middle" fill="#6b7280">
                    {months[i]}
                </text>
            ))}

            <polyline points={points} fill="none" stroke="#111827" strokeWidth="2" />

            {data.map((v, i) => (
                <g key={i}>
                    <circle cx={getX(i)} cy={getY(v)} r="3" fill="#111827" />
                    <text x={getX(i)} y={getY(v) - 8} fontSize="10" textAnchor="middle" fill="#111827">
                        {v}
                    </text>
                </g>
            ))}
        </svg>
    );
};

export default AdminChart;