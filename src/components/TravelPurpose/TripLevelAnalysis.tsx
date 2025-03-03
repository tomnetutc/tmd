import { useEffect, useState } from "react";
import {
  TripChartDataProps,
  weekOption,
  Option,
  DataRow,
  TripPurposeOption,
} from "../../Types";
import {
  TripLevelDataProvider,
  TripLevelTripPurposeOptions,
  TripLevelDataFilter,
  getTotalRowsForYear,
} from "../../utils/Helpers";
import "../../css/travelpurpose.scss";
import "../../css/tripDropdown.css";
import { prepareVerticalChartData } from "./TripLevelDataCalculations";
import HistogramChart from "../../Histogram/Histogram";
import Select, { MultiValue } from "react-select";
import AreaChartComponent from "../../AreaChart/AreaChart";
import CustomSegment from "../../CustomSegment";

interface TripLevelAnalysisProp {
  menuSelectedOptions: Option[];
  toggleState: boolean;
  selections: {
    week?: weekOption;
    analysisYear?: string;
    includeDecember?: boolean;
  };
  setIsTripLevelAnalysisLoading: (isLoading: boolean) => void;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

const TripLevelAnalysis: React.FC<TripLevelAnalysisProp> = ({
  menuSelectedOptions,
  toggleState,
  selections,
  setIsTripLevelAnalysisLoading,
  setProgress,
}) => {
  const [tripLevelFilteredData, setTripLevelFilteredData] = useState<DataRow[]>(
    []
  );
  const [tripDurationChartData, setTripDurationChartData] =
    useState<TripChartDataProps>({ labels: [], datasets: [] });
  const [tripStartChartData, setTripStartChartData] =
    useState<TripChartDataProps>({ labels: [], datasets: [] });
  const [tripModeDistributionChartData, setTripModeDistributionChartData] =
    useState<TripChartDataProps>({ labels: [], datasets: [] });
  const [dropdownOptions, setDropdownOptions] = useState<TripPurposeOption[]>(
    TripLevelTripPurposeOptions
  );
  const [optionValue, setOptionValue] = useState<TripPurposeOption[]>(
    TripLevelTripPurposeOptions.length > 0
      ? [TripLevelTripPurposeOptions[0]]
      : []
  );
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [segmentSize, setSegmentSize] = useState<number>(0);
  const formatter = new Intl.NumberFormat("en-US");

  const incrementProgress = (value: number) => {
    setProgress((prev) => Math.min(prev + value, 100));
  };

  const handleDropdownValueChange = (
    selectedOption: MultiValue<TripPurposeOption>
  ) => {
    if (selectedOption.length === 0 && dropdownOptions.length > 0) {
      setOptionValue([dropdownOptions[0]]);
    } else {
      setOptionValue(selectedOption as TripPurposeOption[]);
    }
    setIsOptionDisabled(selectedOption.length >= 5);
  };

  useEffect(() => {
    const { analysisYear, week } = selections;
    if (!analysisYear || !week || optionValue.length === 0) return;

    setProgress(0);
    // setIsTripLevelAnalysisLoading(true);

    let loadingComplete = false;

    // 🔹 Increment progress randomly (1-3%) every 200ms until reaching 80%
    const incrementProgressSmoothly = setInterval(() => {
      setProgress((prev) => {
        if (prev < 80) {
          return Math.min(prev + Math.floor(Math.random() * 3) + 1, 80);
        } else {
          clearInterval(incrementProgressSmoothly);
          return prev;
        }
      });
    }, 300);

    const dataProvider = TripLevelDataProvider.getInstance();

    Promise.all([
      TripLevelDataFilter(
        dataProvider,
        menuSelectedOptions,
        analysisYear,
        week,
        toggleState
      ),
      getTotalRowsForYear(dataProvider, analysisYear),
    ])
      .then(([tripLevelFilteredData, totalRowsForYear]) => {
        loadingComplete = true;
        clearInterval(incrementProgressSmoothly); // Ensure progress stops at 80%

        // 🔹 Ensure reaching exactly 80%
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

        // 🔹 Process the chart data
        const {
          tripsDurationChartData,
          tripStartTimeChartData,
          tripModeDistributionChartData,
          segmentSize,
        } = prepareVerticalChartData(
          tripLevelFilteredData,
          analysisYear,
          optionValue,
          selections.includeDecember,
          "Travel mode"
        );

        setTripLevelFilteredData(tripLevelFilteredData);
        setTripDurationChartData(tripsDurationChartData);
        setTripModeDistributionChartData(tripModeDistributionChartData);
        setTripStartChartData(tripStartTimeChartData);
        setSegmentSize(segmentSize);

        // 🔹 Final smooth transition from 80% → 100%
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
        setTimeout(() => setIsTripLevelAnalysisLoading(false), 300);
      });

    return () => clearInterval(incrementProgressSmoothly); // Cleanup on unmount
  }, [menuSelectedOptions, selections, toggleState, optionValue]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div className="trip-parent-dropdown-holder">
          <CustomSegment
            title="Segment size: "
            segmentSize={formatter.format(segmentSize)}
            unit="persons"
          />
          <div className="trip-dropdown-container">
            <label className="trip-segment-label">Trip purpose:</label>
            <Select
              className="trip-dropdown-select"
              classNamePrefix="dropdown-select"
              value={optionValue}
              onChange={handleDropdownValueChange}
              options={dropdownOptions}
              isSearchable={true}
              isMulti
            />
          </div>
        </div>
        <div className="chart-wrapper">
          <div className="chart-container-1">
            <HistogramChart
              chartData={tripDurationChartData}
              title="Travel time distribution"
              showLegend={true}
              yAxisLabel="Duration (min)"
              xAxisLabel="%"
              invertAxis={true}
            />
          </div>
        </div>
        <div className="chart-wrapper">
          <div className="chart-container-1">
            <AreaChartComponent
              chartData={tripStartChartData}
              title="Temporal distribution"
              showLegend={true}
              xAxisLabel="Starting Hour"
              yAxisLabel="%"
            />
          </div>
        </div>
        <div className="chart-wrapper">
          <div className="chart-container-1">
            <HistogramChart
              chartData={tripModeDistributionChartData}
              title="Travel mode by purpose"
              showLegend={true}
              xAxisLabel="%"
              invertAxis={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TripLevelAnalysis;
