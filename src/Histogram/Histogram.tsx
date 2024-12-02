import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TripChartDataProps } from "../Types";

interface HistogramProps {
    chartData: TripChartDataProps; // Accepting ChartDataProps as input
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

const HistogramChart: React.FC<HistogramProps> = ({ chartData, title, showLegend = true }) => {

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
                <BarChart data={transformedData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
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
                        <Bar
                            key={dataset.label}
                            dataKey={dataset.label} // Use dataset label as key
                            fill={dataset.backgroundColor} // Use backgroundColor from dataset
                            name={dataset.label} // Use dataset label for legend
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HistogramChart;
