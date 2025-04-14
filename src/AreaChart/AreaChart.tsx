import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TripChartDataProps } from '../Types';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';

interface AreaChartProps {
  chartData: TripChartDataProps | undefined;
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
}

const CustomLegend: React.FC<{ payload?: any[]; chartData: TripChartDataProps }> = ({
  payload,
  chartData,
}) => {
  if (!payload || !Array.isArray(payload)) return null;
  const formatter = new Intl.NumberFormat('en-US');
  return (
    <ul className="custom-legend" style={{ textAlign: 'center', margin: '10px 0' }}>
      {payload.map((entry, index) => {
        const dataset = chartData.datasets.find((ds) => ds.label === entry.value);
        const totalNum: number = dataset?.totalNum || 0;
        return (
          <li
            key={`item-${index}`}
            style={{ color: entry.color, display: 'inline', marginRight: '20px' }}
          >
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

const AreaChartComponent: React.FC<AreaChartProps> = ({
  chartData,
  title,
  xAxisLabel = '',
  yAxisLabel = '',
  showLegend = true,
}) => {
  const [showFill, setShowFill] = useState(0);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setShowFill(newValue as number);
  };

  // Gracefully fallback if data is missing or invalid
  const hasValidData =
    chartData &&
    Array.isArray(chartData.labels) &&
    chartData.labels.length > 0 &&
    Array.isArray(chartData.datasets) &&
    chartData.datasets.length > 0 &&
    chartData.datasets.some(
      (ds) => Array.isArray(ds.data) && ds.data.length > 0
    );

  const safeChartData: TripChartDataProps = hasValidData
    ? chartData!
    : {
        labels: ['No Data'],
        datasets: [
          {
            label: 'No Data',
            data: [0],
            totalNum: 0,
            average: -1,
            backgroundColor: '#d3d3d3',
            borderColor: '#999999',
            barThickness: 'flex',
          },
        ],
      };

  const transformedData = safeChartData.labels.map((label, index) => {
    const obj: { [key: string]: string | number } = {
      name: Array.isArray(label) ? label.join(', ') : label,
    };
    safeChartData.datasets.forEach((dataset) => {
      const value = dataset.data?.[index] ?? 0;
      obj[dataset.label] = parseFloat(value.toFixed(2));
    });
    return obj;
  });

  return (
    <div className="chart-container">
      <div className="title-container">
        <span
          className="title"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {title}
          <StyledSlider
            value={showFill}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            aria-label="show fill"
          />
        </span>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={transformedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              offset: 10,
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: any) => parseFloat(value.toFixed(2)) + '%'}
          />
          {showLegend && (
            <Legend
              content={(props) => (
                <CustomLegend {...props} chartData={safeChartData} />
              )}
              layout="horizontal"
              verticalAlign="top"
              align="center"
            />
          )}
          {safeChartData.datasets.map((dataset) => (
            <Area
              key={dataset.label}
              type="monotone"
              dataKey={dataset.label}
              fill={dataset.backgroundColor}
              stroke={dataset.borderColor}
              strokeWidth={3}
              name={dataset.label}
              fillOpacity={Number(showFill) / 100}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;
