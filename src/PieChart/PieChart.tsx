import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { PieChartDataProps } from '../Types';
import "../PieChart/PieChart.scss"


const tooltipFormatter = (value: number) => {
    return Number(value) % 1 === 0 ? `${value}.0` : value.toString();
};

const RechartsPieChart: React.FC<{ chartData: PieChartDataProps, title: string, showLegend: boolean }> = ({ chartData, title, showLegend }) => {
    const transformedData = chartData.datasets.map(dataset => ({
        name: dataset.label,
        value: dataset.data,
        color: dataset.backgroundColor
    }));

    return (
        <div className="chart-container">
            <div className="title-container">
                <span className="title">{title}</span>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={transformedData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label
                    >
                        {transformedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={tooltipFormatter} />
                    {showLegend && <Legend verticalAlign="top" align="right" />}
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RechartsPieChart;
