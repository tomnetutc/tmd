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
import "../LineChart/LineChart.scss";
import { ChartDataProps } from "../Types";

/** Downward arrow download icon */
const DownloadSvg: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Down arrow with tray */}
    <path d="M12 16l6-6h-4V4H10v6H6l6 6zm-7 2h14v2H5v-2z" />
  </svg>
);

/** Quote a field if it contains commas, quotes, or newlines */
function quoteField(field: string | number): string {
  const str = String(field);
  if (str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  if (str.includes(",") || str.includes("\n")) {
    return `"${str}"`;
  }
  return str;
}

/** Convert chart data into CSV text */
const chartDataToCSV = (
  data: { [key: string]: string | number }[],
  datasets: { label: string }[]
): string => {
  const header = ["Name", ...datasets.map((ds) => ds.label)]
    .map(quoteField)
    .join(",");

  const rows = data.map((entry) => {
    const row = [
      entry.name,
      ...datasets.map((ds) => entry[ds.label] || 0),
    ].map(quoteField);
    return row.join(",");
  });

  return [header, ...rows].join("\r\n");
};

const RechartsLineChart: React.FC<{
  chartData: ChartDataProps | undefined;
  title: string;
  showLegend: boolean;
  yAxisLabel?: string;
}> = ({ chartData, title, showLegend, yAxisLabel }) => {
  // Validate & fallback
  const hasValidData =
    chartData &&
    Array.isArray(chartData.labels) &&
    chartData.labels.length > 0 &&
    Array.isArray(chartData.datasets) &&
    chartData.datasets.length > 0 &&
    chartData.datasets.every((ds) => Array.isArray(ds.data));

  const safeChartData: ChartDataProps = hasValidData
    ? chartData!
    : {
        labels: ["No Data"],
        datasets: [
          {
            label: "No Data",
            data: [0],
            backgroundColor: "#d3d3d3", // Added to match ChartDataProps
            borderColor: "#999999",
            barThickness: "flex", // Added to match ChartDataProps
            borderWidth: 1, // Optional, added for completeness
          },
        ],
      };

  const transformedData = useMemo(() => {
    return safeChartData.labels.map((label, index) => {
      const obj: { [key: string]: string | number } = {
        name: Array.isArray(label) ? label.join(", ") : label,
      };
      safeChartData.datasets.forEach((dataset) => {
        obj[dataset.label] = dataset.data[index] ?? 0;
      });
      return obj;
    });
  }, [safeChartData]);

  // Define tooltipFormatter inside the component to access yAxisLabel
  const tooltipFormatter = (value: number) => {
    const formattedValue =
      Number(value) % 1 === 0 ? `${value}.0` : value.toString();
    return yAxisLabel ? `${formattedValue}${yAxisLabel}` : formattedValue;
  };

  // Download CSV handler
  const handleDownload = () => {
    const csv = chartDataToCSV(
      transformedData,
      safeChartData.datasets.map((ds) => ({ label: ds.label }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, "_")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="chart-container">
      <div className="title-container">
        <span className="title">
          {title}
          <div className="controls">
            <button
              className="download-btn"
              onClick={handleDownload}
              aria-label="Download CSV"
            >
              <DownloadSvg />
            </button>
          </div>
        </span>
      </div>
      <div className="chart">
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
            {safeChartData.datasets.map((dataset, idx) => (
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
    </div>
  );
};

export default React.memo(RechartsLineChart);