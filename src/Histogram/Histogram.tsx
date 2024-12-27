import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TripChartDataProps, TripPurposeOption } from "../Types";

interface HistogramProps {
    chartData: TripChartDataProps; // Chart data props
    title: string; // Chart title
    xAxisLabel?: string; // Optional x-axis label
    yAxisLabel?: string; // Optional y-axis label
    showLegend?: boolean; // Option to show or hide the legend
}

// Custom Legend Component for displaying dataset names and totals
const CustomLegend: React.FC<{ payload?: any[]; chartData: TripChartDataProps }> = ({ payload, chartData }) => {
    if (!payload || !Array.isArray(payload)) return null;

    const formatter = new Intl.NumberFormat('en-US'); // Number formatter for total numbers

    return (
        <ul className="custom-legend" style={{ textAlign: 'center', margin: '10px 0' }}>
            {payload.map((entry, index) => {
                const dataset = chartData.datasets.find(ds => ds.label === entry.value);
                const totalNum: number = dataset?.totalNum || 0; // Extract total number of items from dataset

                return (
                    <li key={`item-${index}`} style={{ color: entry.color, display: 'inline', marginRight: '20px' }}>
                        {entry.value} (n={formatter.format(totalNum)})
                    </li>
                );
            })}
        </ul>
    );
};

const HistogramChart: React.FC<HistogramProps> = ({
    chartData,
    title,
    xAxisLabel = '', // Default x-axis label if none provided
    yAxisLabel = '', // Default y-axis label if none provided
    showLegend = true
}) => {
    const transformedData = chartData.labels.map((label, index) => {
        const obj: { [key: string]: string | number } = { name: Array.isArray(label) ? label.join(', ') : label };
        chartData.datasets.forEach(dataset => {
            obj[dataset.label] = parseFloat(dataset.data[index].toFixed(1)); // Round data to one decimal place for display
        });
        return obj;
    });

    return (
        <div className="chart-container">
            <div className="title-container">
                <span className="title">{title}</span>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={transformedData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }} tick={{ fontSize: 12 }}  interval={0}/>
                    <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 10 }} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: any) => parseFloat(value.toFixed(1))} />
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
                            dataKey={dataset.label}
                            fill={dataset.backgroundColor}
                            name={dataset.label}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HistogramChart;
