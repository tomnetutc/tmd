import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./LineChart.scss";
import { ChartDataProps } from "../../Types";

const RechartsLineChart: React.FC<{
  chartData: ChartDataProps;
  title: string;
  showLegend: boolean;
  yAxisLabel?: string;
}> = ({ chartData, title, showLegend, yAxisLabel }) => {
  const transformedData = useMemo(() => {
    return chartData.labels.map((label, index) => {
      const obj: { [key: string]: string | number } = {
        name: Array.isArray(label) ? label.join(", ") : label,
      };
      chartData.datasets.forEach((dataset) => {
        obj[dataset.label] = dataset.data[index];
      });
      return obj;
    });
  }, [chartData]);

  const tooltipFormatter = (value: number) => {
    const formattedValue =
      Number(value) % 1 === 0 ? `${value}.0` : value.toFixed(2);

    return yAxisLabel ? `${formattedValue}${yAxisLabel}` : formattedValue;
  };

  return (
    <div className="chart-container">
      <div className="title-container">
        <span className="title">{title}</span>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={transformedData}
          margin={{ top: 10, right: 0, left: -15, bottom: -10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            padding={{ left: 20, right: 20 }}
            tick={{ fontSize: 13, fontFamily: "sans-serif" }}
          />
          <YAxis
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              offset: 21,
            }}
            domain={[0, "auto"]}
            tick={{ fontSize: 13, fontFamily: "sans-serif" }}
          />
          <Tooltip formatter={tooltipFormatter} />
          {showLegend && <Legend verticalAlign="top" align="right" />}
          {chartData.datasets.map((dataset, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={dataset.label}
              stroke={dataset.borderColor}
              strokeWidth={3}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={500}
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default React.memo(RechartsLineChart);
