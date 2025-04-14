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
  labels: (string | number)[],
  datasets: { label: string; data: number[] }[]
): string => {
  const header = ["Label", ...datasets.map((ds) => ds.label)]
    .map(quoteField)
    .join(",");

  const rows = labels.map((lbl, i) => {
    const rawLabel = Array.isArray(lbl) ? lbl.join(", ") : lbl;
    const row = [rawLabel, ...datasets.map((ds) => ds.data[i])].map(quoteField);
    return row.join(",");
  });

  return [header, ...rows].join("\r\n");
};

interface HistogramProps {
  chartData: DayPatternChartDataProps;
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  totalCount?: number;
}

const HistogramChart: React.FC<HistogramProps> = ({
  chartData,
  title,
  xAxisLabel = "",
  yAxisLabel = "",
  showLegend = true,
  totalCount = 0,
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
        grid: { display: false },
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
            let N = (totalCount * val / 100).toFixed(0);

            return `${mappedValue}: ${label}% (n=${N})`; // Show mapped value before data
          },
        },
      },
    },
  };

  // Download CSV handler
  const handleDownload = () => {
    const csv = chartDataToCSV(
      dataForChartJS.labels,
      dataForChartJS.datasets.map((ds) => ({
        label: ds.label,
        data: ds.data as number[],
      }))
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
      <div className="chart" style={{ width: "100%", height: 550 }}>
        <Bar data={dataForChartJS} options={options} />
      </div>
    </div>
  );
};

export default HistogramChart;