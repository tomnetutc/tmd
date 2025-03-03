import { useEffect, useState, useRef } from "react";
import {
  TripChartDataProps,
  weekOption,
  Option,
  DataRow,
  TravelModeOption,
} from "../../Types";
import {
  TripLevelDataProvider,
  TripLevelTravelModeOptions,
  TripLevelDataFilter,
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
  const [dropdownOptions, setDropdownOptions] = useState<TravelModeOption[]>(
    TripLevelTravelModeOptions
  );
  const [optionValue, setOptionValue] = useState<TravelModeOption[]>(
    TripLevelTravelModeOptions.length > 0 ? [TripLevelTravelModeOptions[0]] : []
  );
  const [segmentSize, setSegmentSize] = useState<number>(0);
  const formatter = new Intl.NumberFormat("en-US");

  const isFetchingRef = useRef(false); // Prevents multiple API calls

  const incrementProgress = (target: number) => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 5) + 3;
      setProgress((prev) => Math.min(prev + current, target));
      if (current >= target) clearInterval(interval);
    }, 100);
  };

  const handleDropdownValueChange = (
    selectedOption: MultiValue<TravelModeOption>
  ) => {
    setOptionValue(
      selectedOption.length === 0
        ? [dropdownOptions[0]]
        : (selectedOption as TravelModeOption[])
    );
  };

  useEffect(() => {
    const allTripPurposeOption = TripLevelTravelModeOptions.find(
      (option) => option.label === "All"
    );
    const sortedTripPurposeOptions = TripLevelTravelModeOptions.filter(
      (option) => option.label !== "All"
    ).sort((a, b) => a.label.localeCompare(b.label));
    setDropdownOptions(
      allTripPurposeOption
        ? [allTripPurposeOption, ...sortedTripPurposeOptions]
        : sortedTripPurposeOptions
    );
  }, []);

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
    ])
      .then(([tripLevelFilteredData]) => {
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
            <label className="trip-segment-label">Travel mode:</label>
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
              title="Trip purpose by mode"
              showLegend={true}
              xAxisLabel="%"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TripLevelAnalysis;
