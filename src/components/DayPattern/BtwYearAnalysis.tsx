import { useEffect, useState } from "react";
import {
  ChartDataProps,
  weekOption,
  Option,
  SampleSizeTableProps,
  DataRow,
  DayPatternOption,
} from "../../Types";
import {
  DayPatternDataProvider,
  fetchAndFilterDataForBtwYearAnalysis,
  DayPatternOptions,
} from "../../utils/Helpers";
import "../../css/travelpurpose.scss";
import "../../css/dropdowns.css";
import { prepareVerticalChartData } from "./BtwYearDataCalculations";
import SampleSizeTable from "../../SampleSizeTable";
import RechartsLineChart from "../../DayPatternCharts/DayPatternLineChart/LineChart";
import Select, { MultiValue } from "react-select";
import CustomOption from "./ToolTipOptionMultiSelect";

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
  const [dropdownOptions, setDropdownOptions] =
    useState<DayPatternOption[]>(DayPatternOptions);
  const [optionValue, setOptionValue] = useState<DayPatternOption[]>([
    DayPatternOptions[0],
  ]);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);

  useEffect(() => {
    const sortedTripModeOptions = DayPatternOptions.filter(
      (option) => option.label !== "0"
    ).sort((a, b) => a.label.length - b.label.length);
    setDropdownOptions(sortedTripModeOptions);
  }, []);

  const handleDropdownValueChange = (
    selectedOption: MultiValue<DayPatternOption>
  ) => {
    if (selectedOption.length === 0 && dropdownOptions.length > 0) {
      setOptionValue([dropdownOptions[0]]);
    } else if (selectedOption) {
      setOptionValue(selectedOption as DayPatternOption[]);
    }
    setIsOptionDisabled(selectedOption.length >= 5);
  };

  useEffect(() => {
    const { startYear, endYear, week } = selections;
    if (!startYear || !endYear || !week || optionValue.length === 0) return;

    setProgress(0);

    let loadingComplete = false;

    // Increment progress randomly in steps of 1-3
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
      DayPatternDataProvider.getInstance(),
      menuSelectedOptions,
      week,
      toggleState
    )
      .then((btwYearFilteredData) => {
        loadingComplete = true;
        clearInterval(incrementProgressSmoothly); // Stop random increments

        setProgress((prev) => prev + (80 - prev)); // Instantly reach 80%

        const { tripsChartData, minYear, maxYear, sampleSizeTableData } =
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
        setMinYear(minYear);
        setMaxYear(maxYear);
        setSampleSizeTableData(sampleSizeTableData);

        // Gradually increase from 80 to 100%
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
            <label className="segment-label">Day pattern:</label>
            <Select
              className="dropdown-select"
              classNamePrefix="dropdown-select"
              value={optionValue}
              onChange={handleDropdownValueChange}
              options={dropdownOptions.map((option) => ({
                ...option,
                isDisabled:
                  isOptionDisabled &&
                  !optionValue.some(
                    (selected) => selected.value === option.value
                  ),
              }))}
              isSearchable={true}
              components={{ Option: CustomOption }}
              menuPosition={"fixed"}
              maxMenuHeight={200}
              hideSelectedOptions={false}
              isMulti
            />
          </div>
        </div>
        <div className="chart-wrapper">
          <div className="chart-container-1">
            <RechartsLineChart
              chartData={tripChartData}
              title="Percent of individuals by day pattern"
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
