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
import { sort } from "d3";

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
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [dropdownOptions, setDropdownOptions] =
    useState<DayPatternOption[]>(DayPatternOptions);
  const [dropdownLabel, setDropdownLabel] = useState<string>("Trip purpose");
  const [optionValue, setOptionValue] = useState<DayPatternOption[]>(
    DayPatternOptions.length > 0 ? [DayPatternOptions[0]] : []
  );
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);

  const incrementProgress = (value: number) => {
    setProgress((prev) => Math.min(prev + value, 100));
  };

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

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: "36px",
      fontSize: "14px",
    }),
  };

  const CustomDropdownIndicator: React.FC<{}> = () => (
    <div className="dropdown-indicator">
      <svg
        width="15"
        height="15"
        fill="currentColor"
        className="bi bi-chevron-down"
        viewBox="-2 -2 21 21"
      >
        <path
          fillRule="evenodd"
          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
        />
      </svg>
    </div>
  );

  const getOptionDisabledState = (option: DayPatternOption) => {
    const isSelected = optionValue.some(
      (selectedOption) => selectedOption.value === option.value
    );
    return isOptionDisabled && !isSelected;
  };

  const modifiedDropdownOptions = dropdownOptions.map((option) => ({
    ...option,
    isDisabled: getOptionDisabledState(option),
  }));

  useEffect(() => {
    const sortedTripModeOptions = DayPatternOptions.filter(
      (option) => option.label !== "0"
    ).sort((a, b) => a.label.length - b.label.length);
    setDropdownOptions(sortedTripModeOptions);
  }, []);

  useEffect(() => {
    const { startYear, endYear, week } = selections;
    if (
      !startYear ||
      !endYear ||
      !week ||
      !optionValue ||
      optionValue.length === 0
    ) {
      return;
    }

    setIsBtwYearLoading(true);
    setProgress(0);
    incrementProgress(10);

    fetchAndFilterDataForBtwYearAnalysis(
      DayPatternDataProvider.getInstance(),
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
            selections.includeDecember,
            optionValue,
            "Travel mode"
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
              styles={customStyles}
              onChange={handleDropdownValueChange}
              options={modifiedDropdownOptions}
              isSearchable={true}
              components={{
                Option: CustomOption,
                DropdownIndicator: CustomDropdownIndicator,
              }}
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
