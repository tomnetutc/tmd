import { useEffect, useState } from "react";
import {
  ChartDataProps,
  weekOption,
  Option,
  SampleSizeTableProps,
  DataRow,
  TravelModeOption,
} from "../../Types";
import {
  TravelDataProvider,
  fetchAndFilterDataForBtwYearAnalysis,
  TravelModeOptions,
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
  const [durationChartData, setDurationChartData] = useState<ChartDataProps>({
    labels: [],
    datasets: [],
  });
  const [sampleSizeTableData, setSampleSizeTableData] =
    useState<SampleSizeTableProps>({ years: [], counts: [] });

  const [optionValue, setOptionValue] = useState<TravelModeOption[]>(
    TravelModeOptions.length > 0 ? [TravelModeOptions[0]] : []
  );
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);

  const incrementProgress = (value: number) => {
    setProgress((prev) => Math.min(prev + value, 100));
  };

  const [travelModeDropdownOptions, setTravelModeDropdownOptions] = useState<
  TravelModeOption[]
>([]);


  useEffect(() => {
    const allTravelModeOption = TravelModeOptions.find(
      (option) => option.label === "All"
    );

    const sortedTravelModeOptions = TravelModeOptions.filter(
      (option) => option.label !== "All"
    ).sort((a, b) => a.label.localeCompare(b.label));

    const dropdownOptions = allTravelModeOption
      ? [allTravelModeOption, ...sortedTravelModeOptions]
      : sortedTravelModeOptions;
    setTravelModeDropdownOptions(dropdownOptions);
  }, []);

  const getOptionDisabledState = (option: TravelModeOption) => {
    const isSelected = optionValue.some((selectedOption) => selectedOption.value === option.value);
    return isOptionDisabled && !isSelected;
  };

  const modifiedDropdownOptions = travelModeDropdownOptions.map((option) => ({
    ...option,
    isDisabled: getOptionDisabledState(option),
  }));

  const handleDropdownValueChange = (
    selectedOption: MultiValue<TravelModeOption>
  ) => {
    if (selectedOption.length === 0 && travelModeDropdownOptions.length > 0) {
      setOptionValue([travelModeDropdownOptions[0]]);
    } else if (selectedOption) {
      setOptionValue(selectedOption as TravelModeOption[]);
    }
    setIsOptionDisabled(selectedOption.length >= 5);
  };


  useEffect(() => {
    const { startYear, endYear, week } = selections;

    if (!startYear || !endYear || !week || optionValue.length === 0) {
      return;
    }

    setProgress(0);

    let loadingComplete = false;

    // Increment progress randomly from 1-3% every 500ms until reaching 80%
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

    fetchAndFilterDataForBtwYearAnalysis(
      TravelDataProvider.getInstance(),
      menuSelectedOptions,
      week,
      toggleState
    )
      .then((btwYearFilteredData) => {
        loadingComplete = true;
        clearInterval(incrementProgressSmoothly);

        // Smoothly reach 80% if not there yet
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

        const { tripsChartData, durationChartData, sampleSizeTableData } =
          prepareVerticalChartData(
            btwYearFilteredData,
            startYear,
            endYear,
            selections.includeDecember,
            optionValue,
            "Travel mode"
          );

        setBtwYearFilteredData(btwYearFilteredData);
        setTripChartData(tripsChartData);
        setDurationChartData(durationChartData);
        setSampleSizeTableData(sampleSizeTableData);

        // After reaching 80%, gradually go to 100%
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
        setTimeout(() => setIsBtwYearLoading(false), 300);
      });

    return () => clearInterval(incrementProgressSmoothly);
  }, [menuSelectedOptions, selections, toggleState, optionValue]);

  return (
    <>
          <div style={{ position: "relative" }}>
          <div className="parent-dropdown-holder">
          <div className="dropdown-container">
            <label className="segment-label">Travel mode:</label>
            <Select
              className="dropdown-select"
              classNamePrefix="dropdown-select"
              value={optionValue}
              onChange={handleDropdownValueChange}
              options={modifiedDropdownOptions}
              isSearchable={true}
              menuPosition={"fixed"}
              maxMenuHeight={200}
              hideSelectedOptions={false}
              isMulti
            />
          </div>
        </div>

      <div style={{ position: "relative" }}>
        <div className="chart-wrapper">
          <div className="chart-container-1">
            <RechartsLineChart
              chartData={tripChartData}
              title="Average number of trips per person"
              showLegend={true}
            />
          </div>

          <div className="chart-container-1">
            <RechartsLineChart
              chartData={durationChartData}
              title="Average travel duration per person (min)"
              showLegend={true}
            />
          </div>
        </div>

        <SampleSizeTable
          years={sampleSizeTableData.years}
          counts={sampleSizeTableData.counts}
        />
      </div>
      </div>
    </>
  );
};

export default BtwYearAnalysis;
