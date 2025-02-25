import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import "./LineChart.scss";
import { ChartDataProps } from '../../Types';

import { DayPatternMap } from "../../utils/Helpers"; // Ensure this is correctly imported

const tooltipFormatter = (value: number, name: string) => {
    const mappedLabel = DayPatternMap[name] || name; // Map label using DayPatternMap, fallback to original name

    // Ensure formatting is consistent
    const formattedValue = Number(value) % 1 === 0 ? `${value}.0` : value.toFixed(2)+'%';

    return [formattedValue, mappedLabel]; // Return value and updated label
};

const RechartsLineChart: React.FC<{ chartData: ChartDataProps, title: string, showLegend: boolean , yAxisLabel?: string}> = ({ chartData, title, showLegend, yAxisLabel }) => {
    const transformedData = chartData.labels.map((label, index) => {
        const obj: { [key: string]: string | number } = { name: Array.isArray(label) ? label.join(', ') : label };
        chartData.datasets.forEach(dataset => {
            obj[dataset.label] = dataset.data[index];
        });
        return obj;
    });    

    return (
        <div className="chart-container">
            <div className="title-container">
                <span className="title">{title}</span>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={transformedData} margin={{ top: 10, right: 0, left: -15, bottom: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" padding={{ left: 20, right: 20 }} tick={{ fontSize: 13, fontFamily: 'sans-serif' }} />
                    <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', offset: 21 }} domain={[0, 'auto']} tick={{ fontSize: 13, fontFamily: 'sans-serif' }} />
                    <Tooltip formatter={tooltipFormatter} />
                    {showLegend && <Legend verticalAlign="top" align="right" />}
                    {chartData.datasets.map((dataset, idx) => (
                        <Line
                            key={idx}
                            type="monotone"
                            dataKey={dataset.label} // Exact string from your transformed data
                            stroke={dataset.borderColor}
                            strokeWidth={3}
                            activeDot={{ r: 6 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RechartsLineChart;
