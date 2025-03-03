import React from "react";
import "./Histogram.scss";
import { DayPatternChartDataProps } from "../../Types";
import { DayPatternMap } from "../../utils/Helpers";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface HistogramProps {
  chartData: DayPatternChartDataProps;
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  totalCount?:number;
}

const HistogramChart: React.FC<HistogramProps> = ({
  chartData,
  title,
  xAxisLabel = "",
  yAxisLabel = "",
  showLegend = true,
  totalCount =0
}) => {
  const finalLabels = chartData.labels.map((lbl) =>
    Array.isArray(lbl) ? lbl.join(", ") : lbl
  );

  const finalDatasets = chartData.datasets.map((dataset) => ({
    label: dataset.label[0] || "Dataset",
    data: dataset.data,
    backgroundColor: dataset.backgroundColor,
  }));

  const dataForChartJS = {
    labels: finalLabels,
    datasets: finalDatasets,
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {},
        ticks: {
          font: {
            size: 12,
          },
        },
        title: {
          display: Boolean(xAxisLabel),
          text: xAxisLabel,
        },
      },
      y: {
        grid: {display: false},
        ticks: {
          font: {
            size: 12,
          },
        },
        title: {
          display: Boolean(yAxisLabel),
          text: yAxisLabel,
        },
      },
    },
    plugins: {
      datalabels: {
            display: false, // This truly disables on-bar labels
          },          
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = "";
            let val = context.raw;
            const categoryLabel = context.label; // Key from the chart labels
            const mappedValue = DayPatternMap[categoryLabel] || categoryLabel; // Get mapped value from DayPatternMap
                        
            if (Number(val) % 1 === 0) {
              label += `${val}.00`;
            } else {
              label += val;
            }
            let N=(totalCount*val/100).toFixed(0);

            return `${mappedValue}: ${label}% (n=${N})`; // Show mapped value before data
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
