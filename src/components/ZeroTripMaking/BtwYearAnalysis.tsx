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
import Infobox from '../InfoBox/InfoBox';

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

    setProgress(0);

    let loadingComplete = false;

    // Gradually increment progress randomly between 1-3% every 500ms until reaching 80%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 80) {
          return Math.min(prev + Math.floor(Math.random() * 3) + 1, 80);
        } else {
          clearInterval(progressInterval);
          return prev;
        }
      });
    }, 300);

    fetchAndFilterDataForBtwYearAnalysis(
      TravelDataProvider.getInstance(),
      menuSelectedOptions,
      week,
      toggleState
    )
      .then((btwYearFilteredData) => {
        loadingComplete = true;
        clearInterval(progressInterval);

        // Smoothly transition to 80% if it's not already there
        const targetProgress = 80;
        const reach80Interval = setInterval(() => {
          setProgress((prev) => {
            if (prev < targetProgress) {
              return prev + Math.ceil((targetProgress - prev) / 5);
            } else {
              clearInterval(reach80Interval);
              return targetProgress;
            }
          });
        }, 50);

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

        // After reaching 80%, gradually move to 100%
        let finalProgress = 80;
        const completeLoading = setInterval(() => {
          finalProgress += Math.floor(Math.random() * 3) + 1;
          setProgress(finalProgress);
          if (finalProgress >= 100) {
            clearInterval(completeLoading);
          }
        }, 100);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setTimeout(() => {
          setIsBtwYearLoading(false);
        }, 300);
      });

    return () => clearInterval(progressInterval);
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
            <Infobox>
              <p>Shows the percent of respondents who did not make any trips on a given day over the analysis period.</p>
            </Infobox>
          </div>
        </div>
        <div className="sampleSizeTable">
        <SampleSizeTable
          years={sampleSizeTableData.years}
          counts={sampleSizeTableData.counts}
        />
        <Infobox style={{  right : "70px"}}>
        <p>Number of respondents per year for the selected segment. It is displayed for “All” by default.</p>
        </Infobox>
      </div>
      </div>
    </>
  );
};

export default BtwYearAnalysis;
