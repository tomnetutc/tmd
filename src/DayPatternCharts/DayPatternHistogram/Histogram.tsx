import React from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { DayPatternChartDataProps } from "../../Types";
import "./Histogram.scss";
import { DayPatternMap } from "../../utils/Helpers";


interface HistogramProps {
    chartData: DayPatternChartDataProps;
    title: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    showLegend?: boolean;
}

// Example Legend (optional)
const CustomLegend: React.FC<{ payload?: any[]; chartData: DayPatternChartDataProps }> = ({
    payload,
    chartData
}) => {
    if (!payload || !Array.isArray(payload)) return null;
    return (
        <ul className="custom-legend" style={{ textAlign: 'center', margin: '10px 0' }}>
        </ul>
    );
};

const HistogramChart: React.FC<HistogramProps> = ({
    chartData,
    title,
    xAxisLabel = '',
    yAxisLabel = '',
    showLegend = true
}) => {
    // Generate unique keys for each dataset
    const datasetKeys = chartData.datasets.map((_, i) => `dataset_${i}`);

    // Transform the data for Recharts
    const transformedData = chartData.labels.map((label, index) => {
        const row: { [key: string]: string | number } = {
            // Ensure "label" is a string
            name: Array.isArray(label) ? label.join(', ') : label
        };

        chartData.datasets.forEach((dataset, dsIndex) => {
            row[datasetKeys[dsIndex]] = dataset.data[index];
            // If you don't need a separate _label, just skip it
            // row[`${datasetKeys[dsIndex]}_label`] = dataset.label[index];
        });

        return row;
    });

    return (
        <div className="chart-container">
            <div className="title-container">
                <span className="title">{title}</span>
            </div>
            <ResponsiveContainer width="100%" height={550}>
                <BarChart
                    data={transformedData}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={170}
                        tick={{ fontSize: 12 }}
                    />
                    <XAxis
                        type="number"
                        label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value: any, dataKey: string, props: any) => {
                            // "name" is your row label from "transformedData"
                            const categoryLabel = props.payload?.name || "";
                            return [`${value.toFixed(2)}%`, DayPatternMap[categoryLabel]];
                        }}
                    />
                    {showLegend && (
                        <Legend
                            content={(props) => <CustomLegend {...props} chartData={chartData} />}
                            layout="horizontal"
                            verticalAlign="top"
                            align="center"
                        />
                    )}

                    {chartData.datasets.map((dataset, dsIndex) => (
                        <Bar
                            key={datasetKeys[dsIndex]}
                            dataKey={datasetKeys[dsIndex]}
                            fill={dataset.backgroundColor}
                            // For the legend label, you could show dataset.label[0] or a static name
                            name={dataset.label[0] || `Dataset ${dsIndex}`}
                            barSize={25}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HistogramChart;
