import React from "react";
import "./Histogram.scss";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
import { TripChartDataProps } from "../Types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle,
  ChartTooltip,
  ChartLegend
);

interface HistogramProps {
  chartData: TripChartDataProps;
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showSampleSize?: boolean; // New prop to control sample size display
  invertAxis?: boolean;
}

const HistogramChart: React.FC<HistogramProps> = ({
  chartData,
  title,
  xAxisLabel = "",
  yAxisLabel = "",
  showLegend = true,
  showSampleSize = false, // Default to false
  invertAxis = false,
}) => {
  const formatter = new Intl.NumberFormat("en-US");

  // Process labels: if a label is an array, join its items with a comma
  const finalLabels = chartData.labels.map((lbl) =>
    Array.isArray(lbl) ? lbl.join(", ") : lbl
  );

  // Process each dataset: round each data point to one decimal place
  const finalDatasets = chartData.datasets.map((dataset) => ({
    label: showSampleSize
      ? `${dataset.label} (n=${formatter.format(dataset.totalNum)})`
      : dataset.label,
    data: dataset.data.map((value) => parseFloat(value.toFixed(2))),
    backgroundColor: dataset.backgroundColor,
  }));

  const dataForChartJS = {
    labels: finalLabels,
    datasets: finalDatasets,
  };

  const indexAxis: "x" | "y" = invertAxis ? "x" : "y";

  const scales = invertAxis
    ? {
        x: {
          grid: { display: false },
          ticks: { font: { size: 12 } },
          title: { display: Boolean(yAxisLabel), text: yAxisLabel },
        },
        y: {
          grid: {},
          ticks: { font: { size: 12 } },
          title: { display: Boolean(xAxisLabel), text: xAxisLabel },
        },
      }
    : {
        x: {
          grid: {},
          ticks: { font: { size: 12 } },
          title: { display: Boolean(xAxisLabel), text: xAxisLabel },
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 12 } },
          title: { display: Boolean(yAxisLabel), text: yAxisLabel },
        },
      };

  const options = {
    indexAxis: indexAxis,
    responsive: true,
    maintainAspectRatio: false,
    scales: scales,
    plugins: {
      datalabels: { display: false },
      legend: { display: showLegend },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.raw;
            return `${parseFloat(val.toFixed(2))}%`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="title-container">
        <span className="title">{title}</span>
      </div>
      <div className="chart" style={{ width: "100%", height: 550 }}>
        <Bar data={dataForChartJS} options={options} />
      </div>
    </div>
  );
};

export default HistogramChart;
