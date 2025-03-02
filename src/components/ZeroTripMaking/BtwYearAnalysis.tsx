import { useEffect, useState } from "react";
import {
  ChartDataProps,
  weekOption,
  Option,
  SampleSizeTableProps,
  DataRow,
  TravelModeOption,
  TripPurposeOption,
} from "../../Types";
import {
  TravelDataProvider,
  fetchAndFilterDataForBtwYearAnalysis,
  TravelModeOptions,
  TripPurposeOptions,
} from "../../utils/Helpers";
import "../../css/travelpurpose.scss";
import "../../css/dropdowns.css";
import { prepareVerticalChartData } from "./BtwYearDataCalculations";
import SampleSizeTable from "../../SampleSizeTable";
import RechartsLineChart from "../../LineChart/LineChart";
import Select, { MultiValue } from "react-select";

interface BtwYearAnalysisProps {
  menuSelectedOptions: Option[];
  toggleState: boolean;
  selections: {
    week?: weekOption;
    startYear?: string;
    endYear?: string;
    includeDecember?: boolean;
  };
  setIsBtwYearLoading: (isLoading: boolean) => void;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

const BtwYearAnalysis: React.FC<BtwYearAnalysisProps> = ({
  menuSelectedOptions,
  toggleState,
  selections,
  setIsBtwYearLoading,
  setProgress,
}) => {
  const [btwYearFilteredData, setBtwYearFilteredData] = useState<DataRow[]>([]);
  const [tripChartData, setTripChartData] = useState<ChartDataProps>({
    labels: [],
    datasets: [],
  });
  const [sampleSizeTableData, setSampleSizeTableData] =
    useState<SampleSizeTableProps>({ years: [], counts: [] });
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  const incrementProgress = (value: number) => {
    setProgress((prev) => Math.min(prev + value, 100));
  };

  useEffect(() => {
    const { startYear, endYear, week } = selections;

    if (!startYear || !endYear || !week) {
      return;
    }

    setIsBtwYearLoading(true);
    setProgress(0);
    incrementProgress(10);

    fetchAndFilterDataForBtwYearAnalysis(
      TravelDataProvider.getInstance(),
      menuSelectedOptions,
      week,
      toggleState
    )
      .then((btwYearFilteredData) => {
        setTimeout(() => incrementProgress(30), 300);

        const { tripsChartData, minYear, maxYear, sampleSizeTableData } =
          prepareVerticalChartData(
            btwYearFilteredData,
            startYear,
            endYear,
            selections.includeDecember
          );

        setBtwYearFilteredData(btwYearFilteredData);
        setTripChartData(tripsChartData);
        setMinYear(minYear);
        setMaxYear(maxYear);
        setSampleSizeTableData(sampleSizeTableData);

        setTimeout(() => incrementProgress(40), 300);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setTimeout(() => {
          incrementProgress(20);
          setIsBtwYearLoading(false);
        }, 300);
      });
  }, [menuSelectedOptions, selections, toggleState]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div className="chart-wrapper" style={{ paddingTop: "0" }}>
          <div className="chart-container-1">
            <RechartsLineChart
              chartData={tripChartData}
              title="Percent of zero-trip makers"
              showLegend={true}
              yAxisLabel="%"
            />
          </div>
        </div>
        <SampleSizeTable
          years={sampleSizeTableData.years}
          counts={sampleSizeTableData.counts}
        />
      </div>
    </>
  );
};

export default BtwYearAnalysis;
