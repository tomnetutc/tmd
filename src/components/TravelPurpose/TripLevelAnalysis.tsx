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
  const [tripPurposeDropdownOptions, setTripPurposeDropdownOptions] = useState<
    TripPurposeOption[]
  >([]);
  const [segmentSize, setSegmentSize] = useState<number>(0);
  const formatter = new Intl.NumberFormat("en-US");

  const incrementProgress = (value: number) => {
    setProgress((prev) => Math.min(prev + value, 100));
  };

  const handleDropdownValueChange = (
    selectedOption: MultiValue<TripPurposeOption>
  ) => {
    if (selectedOption.length === 0 && tripPurposeDropdownOptions.length > 0) {
      setOptionValue([tripPurposeDropdownOptions[0]]);
    } else if (selectedOption) {
      setOptionValue(selectedOption as TripPurposeOption[]);
    }

    setIsOptionDisabled(selectedOption.length >= 5);
  };

  useEffect(() => {
    const allTripPurposeOption = TripLevelTripPurposeOptions.find(
      (option) => option.label === "All"
    );

    const sortedTripPurposeOptions = TripLevelTripPurposeOptions.filter(
      (option) => option.label !== "All"
    ).sort((a, b) => a.label.localeCompare(b.label));

    const tripPurposeDropdownOptions = allTripPurposeOption
      ? [allTripPurposeOption, ...sortedTripPurposeOptions]
      : sortedTripPurposeOptions;
    setTripPurposeDropdownOptions(tripPurposeDropdownOptions);
  }, []);

  useEffect(() => {
    const { analysisYear, week } = selections;

    if (!analysisYear || !week || !optionValue || optionValue.length === 0) {
      return;
    }

    setIsTripLevelAnalysisLoading(true);
    setProgress(0);
    incrementProgress(10);

    TripLevelDataFilter(
      TripLevelDataProvider.getInstance(),
      menuSelectedOptions,
      analysisYear,
      week,
      toggleState
    )
      .then((tripLevelFilteredData) => {
        setTimeout(() => incrementProgress(30), 300);

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
          "Trip purpose"
        );

        setTripLevelFilteredData(tripLevelFilteredData);
        setTripDurationChartData(tripsDurationChartData);
        setTripModeDistributionChartData(tripModeDistributionChartData);
        setTripStartChartData(tripStartTimeChartData);
        setSegmentSize(segmentSize);

        setTimeout(() => incrementProgress(40), 300);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setTimeout(() => {
          incrementProgress(20);
          setIsTripLevelAnalysisLoading(false);
        }, 300);
      });
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
              menuPosition={"fixed"}
              maxMenuHeight={200}
              hideSelectedOptions={false}
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
              showSampleSize={true}
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
              title="Travel mode distribution by trip purpose"
              showLegend={true}
              xAxisLabel="%"
              showSampleSize={true}
              invertAxis={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TripLevelAnalysis;
