import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TripChartDataProps } from "../Types";
import Slider from '@mui/material/Slider';  // Importing Slider component
import { styled } from '@mui/material/styles';

interface AreaChartProps {
    chartData: TripChartDataProps;
    title: string;
    xAxisLabel?: string; // Optional x-axis label
    yAxisLabel?: string; // Optional y-axis label
    showLegend?: boolean;
}

const CustomLegend: React.FC<{ payload?: any[]; chartData: TripChartDataProps }> = ({ payload, chartData }) => {
    if (!payload || !Array.isArray(payload)) return null;
    const formatter = new Intl.NumberFormat('en-US');
    return (
        <ul className="custom-legend" style={{ textAlign: 'center', margin: '10px 0' }}>
            {payload.map((entry, index) => {
                const dataset = chartData.datasets.find(ds => ds.label === entry.value);
                const totalNum: number = dataset?.totalNum || 0;
                return (
                    <li key={`item-${index}`} style={{ color: entry.color, display: 'inline', marginRight: '20px' }}>
                        {entry.value} (n={formatter.format(totalNum)})
                    </li>
                );
            })}
        </ul>
    );
};

const StyledSlider = styled(Slider)({
    width: 100,
    color: 'primary',
});

const AreaChartComponent: React.FC<AreaChartProps> = ({ chartData, title, xAxisLabel = '', yAxisLabel = '', showLegend = true }) => {
    const [showFill, setShowFill] = useState(0);  // Use range 0 to 100 for the slider

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setShowFill(newValue as number);
    };

    const transformedData = chartData.labels.map((label, index) => {
        const obj: { [key: string]: string | number } = { name: Array.isArray(label) ? label.join(', ') : label };
        chartData.datasets.forEach(dataset => {
            obj[dataset.label] = parseFloat(dataset.data[index].toFixed(1));
        });
        return obj;
    });

    return (
        <div className="chart-container">
            <div className="title-container">
                <span className="title" style={{display: "flex", flexDirection:"row", justifyContent:'space-between', alignItems:'center'}}>{title}
                <StyledSlider
                    value={showFill}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    aria-label="show fill"
                />
                </span>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={transformedData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }} tick={{ fontSize: 12 }} />
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
                        <Area
                            key={dataset.label}
                            type="monotone"
                            dataKey={dataset.label}
                            fill={dataset.backgroundColor}
                            stroke={dataset.borderColor}
                            strokeWidth={3}
                            name={dataset.label}
                            fillOpacity= {Number(showFill) / 100 }
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AreaChartComponent;
