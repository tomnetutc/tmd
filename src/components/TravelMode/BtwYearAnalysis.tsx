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
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [dropdownOptions, setDropdownOptions] =
    useState<TravelModeOption[]>(TravelModeOptions);
  const [optionValue, setOptionValue] = useState<TravelModeOption[]>(
    TravelModeOptions.length > 0 ? [TravelModeOptions[0]] : []
  );
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [tripPurposeDropdownOptions, setTravelModeDropdownOptions] = useState<
    TravelModeOption[]
  >([]);

  const incrementProgress = (value: number) => {
    setProgress((prev) => Math.min(prev + value, 100));
  };

  // Handle dropdown value change based on selected options
  const handleDropdownValueChange = (
    selectedOption: MultiValue<TravelModeOption>
  ) => {
    if (selectedOption.length === 0 && tripPurposeDropdownOptions.length > 0) {
      setOptionValue([tripPurposeDropdownOptions[0]]);
    } else if (selectedOption) {
      setOptionValue(selectedOption as TravelModeOption[]);
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

  useEffect(() => {
    const allTripModeOption = TravelModeOptions.find(
      (option) => option.label === "All"
    );

    const sortedTripModeOptions = TravelModeOptions.filter(
      (option) => option.label !== "All"
    ).sort((a, b) => a.label.localeCompare(b.label));

    const travelModeDropdownOptions = allTripModeOption
      ? [allTripModeOption, ...sortedTripModeOptions]
      : sortedTripModeOptions;
    setTravelModeDropdownOptions(travelModeDropdownOptions);
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
      TravelDataProvider.getInstance(),
      menuSelectedOptions,
      week,
      toggleState
    )
      .then((btwYearFilteredData) => {
        setTimeout(() => incrementProgress(30), 300);

        const {
          tripsChartData,
          durationChartData,
          minYear,
          maxYear,
          sampleSizeTableData,
        } = prepareVerticalChartData(
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
            <label className="segment-label">Travel mode:</label>
            <Select
              className="dropdown-select"
              classNamePrefix="dropdown-select"
              value={optionValue}
              onChange={handleDropdownValueChange}
              options={dropdownOptions}
              isSearchable={true}
              styles={customStyles}
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
    </>
  );
};

export default BtwYearAnalysis;
