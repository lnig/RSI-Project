import React from 'react';

interface PieChartProps {
  percentage: number,     // percentage of marked circle  
  inside?: boolean,       // percent text inside pie chart
  background?: string,    // color of background circle
  foreground?: string,    // color of foreground circle
  size?: number,          // size of pie chart
  strokeWidth?: number,   // width of stroke line, maxValue - 10
}

const PieChart: React.FC<PieChartProps> = ({
  percentage,
  inside = false,
  background = "#e5e7eb",
  foreground = "#EB4C60",
  size = 100,
  strokeWidth = 8,
}) => {
  if (strokeWidth > 10) strokeWidth = 10;
  if (strokeWidth < 1) strokeWidth = 1
  const radius = 15.91549431;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 42 42" className="w-full h-full">
        <circle
          style={{ stroke: background }}
          cx="21"
          cy="21"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
        />
        <circle
          style={{ stroke: foreground }}
          cx="21"
          cy="21"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset="0"
          transform="rotate(-90 21 21)"
          strokeLinecap="round"
        />
        {inside && (
          <text
            x="21"
            y="21"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="6"
            fill={foreground}
            fontWeight="bold"
          >
            {percentage}%
          </text>
        )}
      </svg>
    </div>
  );
};

export default PieChart;
