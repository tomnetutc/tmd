import { useEffect, useState } from "react";
import {
  ChartDataProps,
  weekOption,
  Option,
  SampleSizeTableProps,
  DataRow,
  DayPatternOption,
  AnalysisTypeOption,
  GroupedOptions,
  CountObj,
} from "../../Types";
import {
  DayPatternDataProvider,
  CrossSegmentDataFilter,
  DayPatternOptions,
} from "../../utils/Helpers";
import "../../css/travelpurpose.scss";
import "../../css/dropdowns.css";
import ProfileCards from "../ProfileCard/ProfileCards";
import SampleSizeTable from "../../SampleSizeTable";
import RechartsLineChart from "../../LineChart/LineChart";
import Select, { SingleValue } from "react-select";
import { Colors } from "../../Colors";
import CustomOption from "./ToolTipOptionSingleSelect";
import Infobox from '../InfoBox/InfoBox';

interface CrossSegmentAnalysisProps {
  menuSelectedOptions: Option[][];
  toggleState: boolean;
  selections: {
    week?: weekOption;
    startYear?: string;
    endYear?: string;
    includeDecember?: boolean;
  };
  setIsCrossSegmentLoading: (isLoading: boolean) => void;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  onProfileRemove: (index: number) => void;
}

const CrossSegmentAnalysis: React.FC<CrossSegmentAnalysisProps> = ({
  menuSelectedOptions,
  toggleState,
  selections,
  setIsCrossSegmentLoading,
  setProgress,
  onProfileRemove,
}) => {
  const [crossSegmentFilteredData, setCrossSegmentFilteredData] = useState<
    DataRow[]
  >([]);
  const [chartData, setChartData] = useState<ChartDataProps>({
    labels: [],
    datasets: [],
  });
  const [sampleSizeTableData, setSampleSizeTableData] =
    useState<SampleSizeTableProps>({ years: [], counts: [] });

  const [optionValue, setOptionValue] = useState<DayPatternOption>(
    DayPatternOptions[0]
  );
  const [analysisType, setAnalysisType] = useState<AnalysisTypeOption>({
    label: "Number of trips",
    value: "NumberTrips",
  });

  const incrementProgress = (value: number) => {
    setProgress((prev) => Math.min(prev + value, 100));
  };

  useEffect(() => {
    const { startYear, endYear, week } = selections;
    if (!startYear || !endYear || !week || !optionValue) {
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

    CrossSegmentDataFilter(
      DayPatternDataProvider.getInstance(),
      startYear,
      endYear,
      week,
      toggleState
    )
      .then((filteredData) => {
        loadingComplete = true;
        clearInterval(incrementProgressSmoothly);

        // Smoothly reach 80% if it's not there yet
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

        return prepareChartData(
          filteredData,
          menuSelectedOptions,
          optionValue,
          analysisType,
          startYear,
          endYear,
          selections.includeDecember
        );
      })
      .then(({ chartData, sampleSizeTableData }) => {
        setChartData(chartData);
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
        setTimeout(() => setIsCrossSegmentLoading(false), 300);
      });

    return () => clearInterval(incrementProgressSmoothly);
  }, [menuSelectedOptions, selections, toggleState, optionValue, analysisType]);

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
              onChange={(selectedOption) =>
                setOptionValue(selectedOption as DayPatternOption)
              }
              options={DayPatternOptions}
              isSearchable={true}
              components={{ Option: CustomOption }}
              menuPosition={"fixed"}
              maxMenuHeight={200}
              hideSelectedOptions={false}
            />
          </div>
        </div>
      </div>
      <div className="home">
        <div className="chart-wrapper">
          <div className="chart-container-1">
            <ProfileCards
              profileList={menuSelectedOptions
                .filter((optionsArray) => optionsArray.length > 0)
                .map((optionsArray) => ({
                  profile: optionsArray,
                }))}
              removeProfile={(index: number) => onProfileRemove(index)}
              title="Segments"
            />
            <Infobox>
              <p>Add up to four additional user-defined segments using the segmentation menu above to compare and display their patterns.</p>
            </Infobox>
          </div>
          <div className="chart-container-1">
            <RechartsLineChart
              chartData={chartData}
              title="Share of day pattern by segment"
              showLegend={true}
              yAxisLabel="%"
            />
            <Infobox>
              <p>Shows the percent of individuals following a specific day pattern over time for selected segment(s). A day pattern represents the sequence of trips an individual takes throughout the day, with all patterns starting and ending at home for trip makers. Use the dropdown menu above to select a day pattern and view its shares across years for selected segment(s). The menu shows Home&gt;Work&gt;Home as the default and includes the 30 most common day patterns since 2003.</p>
            </Infobox>
          </div>
        </div>
        <div className="sampleSizeTable">
          <SampleSizeTable
            years={sampleSizeTableData.years}
            counts={sampleSizeTableData.counts}
            crossSegment={true}
            infoboxContent= "Number of respondents per year for selected segment(s)."
          />
        </div>
      </div>
    </>
  );
};

const prepareChartData = (
  filteredData: DataRow[],
  menuSelectedOptions: Option[][],
  optionValue: DayPatternOption,
  analysisType: AnalysisTypeOption,
  startYear: string,
  endYear: string,
  includeDecember: boolean | undefined
): {
  chartData: ChartDataProps;
  sampleSizeTableData: SampleSizeTableProps;
} => {
  type ChartDataType = ChartDataProps["datasets"][number];

  let ChartDataSets: ChartDataType[] = [];
  let sampleSizeCounts: CountObj[] = [];

  const filteredByYearData = filteredData.filter((dataRow) => {
    const year = parseInt(dataRow["year"], 10);
    return year >= Number(startYear) && year <= Number(endYear);
  });

  const labels = Array.from(
    new Set(filteredByYearData.map((item) => parseInt(item.year, 10))) // Convert to integer first
  )
    .sort((a, b) => a - b) // Ensure numeric sorting
    .map((year) => year.toString()); // Convert back to string
  menuSelectedOptions.forEach((optionsGroup, index) => {
    let dataPoints: number[] = [];
    let yearlyCounts: [string, number][] = [];

    let optionFilteredData = [...filteredData];

    const filteredDataWithConditions = optionFilteredData.filter((row) => {
      const isValidYear =
        parseInt(row.year).toString() >= startYear &&
        parseInt(row.year).toString() <= endYear;
      const isValidMonth = includeDecember || parseInt(row.month, 10) !== 12;
      return isValidYear && isValidMonth;
    });

    optionFilteredData = filteredDataWithConditions.filter((row) => {
      // Group options by groupId
      const groupedOptions = optionsGroup.reduce(
        (acc: GroupedOptions, option) => {
          const groupId = option.groupId;
          acc[groupId] = acc[groupId] || [];
          acc[groupId].push(option);
          return acc;
        },
        {}
      );

      return Object.values(groupedOptions).every((group: Option[]) => {
        return group.some((option) => {
          const column = option.id;
          const value = option.val;
          return row[column] === value;
        });
      });
    });

    labels.forEach((year) => {
      const yearData = optionFilteredData.filter(
        (row) => parseInt(row.year).toString() === year
      );

      const filteredYearData = yearData.filter(
        (row) => row.day_pattern === optionValue.label
      );

      let meanValue;
      if (analysisType.value == "NumberTrips") {
        meanValue = filteredYearData.length / yearData.length;
      }

      if (meanValue !== undefined) {
        if (analysisType.value == "NumberTrips") {
          meanValue = parseFloat((meanValue * 100).toFixed(2));
        }
        dataPoints.push(meanValue);
      } else {
        dataPoints.push(0);
      }
    });

    ChartDataSets.push({
      label: index == 0 ? "All" : "Segment " + index,
      data: dataPoints,
      borderColor: Colors[index],
      backgroundColor: Colors[index],
      barThickness: "flex",
    });

    const uniqueYears = Array.from(
      new Set(filteredByYearData.map((item) => parseInt(item.year, 10))) // Convert to integer first
    )
      .sort((a, b) => a - b) // Ensure numeric sorting
      .map((year) => year.toString()); // Convert back to string

    uniqueYears.forEach((year) => {
      yearlyCounts.push([
        year,
        optionFilteredData.filter(
          (row) => parseInt(row.year).toString() === year
        ).length,
      ]);
    });

    sampleSizeCounts.push({ data: optionFilteredData, count: yearlyCounts });
  });

  return {
    chartData: {
      labels: labels,
      datasets: ChartDataSets,
    },
    sampleSizeTableData: {
      years: labels,
      counts: sampleSizeCounts,
    },
  };
};
export default CrossSegmentAnalysis;
