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
  chartData: TripChartDataProps | undefined;
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showSampleSize?: boolean;
  invertAxis?: boolean;
}

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

/** Convert labels and datasets into CSV text */
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

const HistogramChart: React.FC<HistogramProps> = ({
  chartData,
  title,
  xAxisLabel = "",
  yAxisLabel = "",
  showLegend = true,
  showSampleSize = false,
  invertAxis = false,
}) => {
  // Validate & fallback
  const hasValidData =
    chartData &&
    chartData.labels.length > 0 &&
    chartData.datasets.length > 0 &&
    chartData.datasets.some((ds) => ds.data.length > 0);

  const safeChartData: TripChartDataProps = hasValidData
    ? chartData!
    : {
        labels: ["No Data"],
        datasets: [
          {
            label: "No Data",
            data: [0],
            totalNum: 0,
            average: -1,
            backgroundColor: "#d3d3d3",
            borderColor: "#999999",
            barThickness: "flex",
          },
        ],
      };

  // Prepare for chart
  const finalLabels = safeChartData.labels.map((lbl) =>
    Array.isArray(lbl) ? lbl.join(", ") : lbl
  );
  const finalDatasets = safeChartData.datasets.map((ds) => {
    const avgSuffix =
      ds.average >= 0 ? ` (avg: ${ds.average.toFixed(1)} min)` : "";
    return {
      label: ds.label + avgSuffix,
      data: ds.data.map((v) => +v.toFixed(2)),
      backgroundColor: ds.backgroundColor,
      borderColor: ds.borderColor,
      barThickness: ds.barThickness,
    };
  });
  const dataForChartJS = {
    labels: finalLabels,
    datasets: finalDatasets,
  };

  const indexAxis: "x" | "y" = invertAxis ? "x" : "y";
  const scales = invertAxis
    ? {
        x: { grid: { display: false }, title: { display: !!yAxisLabel, text: yAxisLabel } },
        y: { title: { display: !!xAxisLabel, text: xAxisLabel } },
      }
    : {
        x: { title: { display: !!xAxisLabel, text: xAxisLabel } },
        y: { grid: { display: false }, title: { display: !!yAxisLabel, text: yAxisLabel } },
      };

  const options = {
    indexAxis,
    responsive: true,
    maintainAspectRatio: false,
    scales,
    plugins: {
      legend: { display: showLegend },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const v = parseFloat(ctx.raw);
            return isNaN(v) ? "N/A" : `${v.toFixed(2)}%`;
          },
        },
      },
      datalabels: {
        display: false,
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
        <span className="title">{title}</span>
        <button
          className="download-btn"
          onClick={handleDownload}
          aria-label="Download CSV"
        >
          <DownloadSvg />
        </button>
      </div>
      <div className="chart" style={{ width: "100%", height: 550 }}>
        <Bar data={dataForChartJS} options={options} />
      </div>
    </div>
  );
};

export default HistogramChart;