import React from "react";
import { PieChartDataProps } from "../Types";
import "../PieChart/PieChart.scss";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend as ChartLegendPlugin
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, ChartLegendPlugin, ChartDataLabels);

interface ChartJSPieChartProps {
  chartData: PieChartDataProps; // user-defined shape
  title: string;
  showLegend: boolean;
}

// Simple formatter: adds ".0%" if value is whole number, otherwise just "%".
const tooltipFormatter = (value: number) => {
  return Number(value) % 1 === 0 ? `${value}.0%` : `${value}%`;
};

const ChartJSPieChart: React.FC<ChartJSPieChartProps> = ({
  chartData,
  title,
  showLegend,
}) => {
  // 1) Transform data from your chartData.datasets
  const transformedData = chartData.datasets.map((dataset) => ({
    name: dataset.label,
    value: dataset.data,
    color: dataset.backgroundColor,
  }));

  // 2) Build Chart.js data structure
  const dataForChartJS = {
    labels: transformedData.map((item) => item.name),
    datasets: [
      {
        data: transformedData.map((item) => item.value),
        backgroundColor: transformedData.map((item) => item.color),
        borderWidth: 0
      },
    ],
  };

  // 3) Configure Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: "#FFF",
        anchor: "center" as const,
        align: "center" as const,
        formatter: (value: number) => (value > 5 ? `${value}%` : null),
      },
      legend: {
        display: showLegend,
        position: "top" as const,
        align: "center" as const,
        labels: {
          usePointStyle: false,
          boxWidth: 15,
          boxHeight: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const val = tooltipItem.raw;
            return " " + tooltipFormatter(val);
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
      <div style={{ width: "100%", height: 400 }}>
        <Pie data={dataForChartJS} options={options} />
      </div>
    </div>
  );
};

export default ChartJSPieChart;
