import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TripChartDataProps } from "../Types";

interface AreaChartProps {
    chartData: TripChartDataProps; // Accepting TripChartDataProps as input
    title: string;
    showLegend?: boolean; // Option to show or hide legend
}

// Custom Legend Component
const CustomLegend: React.FC<{ payload?: any[]; chartData: TripChartDataProps }> = ({ payload, chartData }) => {
    if (!payload || !Array.isArray(payload)) return null;

    const formatter = new Intl.NumberFormat('en-US'); // Formatter for thousands separator

    return (
        <ul className="custom-legend" style={{ textAlign: 'center', margin: '10px 0' }}>
            {payload.map((entry, index) => {
                // Find the matching dataset by label
                const dataset = chartData.datasets.find(ds => ds.label === entry.value);
                const totalNum: number = dataset?.totalNum || 0; // Extract totalNum

                return (
                    <li key={`item-${index}`} style={{ color: entry.color, display: 'inline', marginRight: '20px' }}>
                        {entry.value} (n={formatter.format(totalNum)}) {/* Display label and totalNum with commas */}
                    </li>
                );
            })}
        </ul>
    );
};

const AreaChartComponent: React.FC<AreaChartProps> = ({ chartData, title, showLegend = true }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null); // Track the currently hovered area

    // Transform chartData to the format required by Recharts
    const transformedData = chartData.labels.map((label, index) => {
        const obj: { [key: string]: string | number } = { name: Array.isArray(label) ? label.join(', ') : label };
        chartData.datasets.forEach(dataset => {
            obj[dataset.label] = parseFloat(dataset.data[index].toFixed(1)); // Round to one decimal place
        });
        return obj;
    });

    return (
        <div className="chart-container">
            <div className="title-container">
                <span className="title">{title}</span>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={transformedData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: any) => parseFloat(value.toFixed(1))} /> {/* Round in Tooltip */}
                    {showLegend && (
                        <Legend
                            content={(props) => <CustomLegend {...props} chartData={chartData} />}
                            layout="horizontal"
                            verticalAlign="top"
                            align="center"
                        />
                    )}
                    {chartData.datasets.map((dataset, index) => (
                        <Area
                            key={dataset.label}
                            type="monotone" // Smooth line between points
                            dataKey={dataset.label} // Use dataset label as key
                            fill={dataset.backgroundColor} // Use backgroundColor from dataset
                            stroke={dataset.borderColor} // Use borderColor from dataset
                            strokeWidth={3}
                            name={dataset.label} // Use dataset label for legend
                            opacity={activeIndex === null || activeIndex === index ? 1 : 0.3} // Highlight or fade other areas
                            onMouseEnter={() => setActiveIndex(index)} // Set active index on hover
                            onMouseLeave={() => setActiveIndex(null)} // Reset active index on leave
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AreaChartComponent;
