const AdminChart = ({ data }) => {
    const width = 500;
    const height = 160;

    const padding = { top: 20, right: 20, bottom: 30, left: 40 };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const months = [
        'Jan','Feb','Mar','Apr','May','Jun',
        'Jul','Aug','Sep','Oct','Nov','Dec'
    ];

    const getX = (i) =>
        padding.left + (i / (data.length - 1)) * chartWidth;

    const getY = (v) =>
        padding.top + chartHeight - ((v - min) / range) * chartHeight;

    const points = data
        .map((v, i) => `${getX(i)},${getY(v)}`)
        .join(' ');

    return (
        <svg width={width} height={height}>
            {/* X Axis */}
            <line
                x1={padding.left}
                y1={padding.top + chartHeight}
                x2={padding.left + chartWidth}
                y2={padding.top + chartHeight}
                stroke="#9ca3af"
            />

            {/* Y Axis */}
            <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={padding.top + chartHeight}
                stroke="#9ca3af"
            />

            {/* Y Axis Labels */}
            {[0, 0.5, 1].map((t, i) => {
                const value = min + t * range;
                const y = getY(value);

                return (
                    <g key={i}>
                        <line
                            x1={padding.left - 5}
                            y1={y}
                            x2={padding.left}
                            y2={y}
                            stroke="#9ca3af"
                        />
                        <text
                            x={padding.left - 8}
                            y={y + 4}
                            fontSize="10"
                            textAnchor="end"
                            fill="#6b7280"
                        >
                            {value.toFixed(0)}
                        </text>
                    </g>
                );
            })}

            {/* X Axis Labels */}
            {data.map((_, i) => (
                <text
                    key={i}
                    x={getX(i)}
                    y={height - 10}
                    fontSize="10"
                    textAnchor="middle"
                    fill="#6b7280"
                >
                    {months[i]}
                </text>
            ))}

            {/* Line */}
            <polyline
                points={points}
                fill="none"
                stroke="#111827"
                strokeWidth="2"
            />

            {/* Points + Values */}
            {data.map((v, i) => {
                const x = getX(i);
                const y = getY(v);

                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r="3" fill="#111827" />
                        <text
                            x={x}
                            y={y - 8}
                            fontSize="10"
                            textAnchor="middle"
                            fill="#111827"
                        >
                            {v}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default AdminChart;