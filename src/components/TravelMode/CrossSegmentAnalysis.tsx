import { useEffect, useState } from "react";
import {
  ChartDataProps,
  weekOption,
  Option,
  SampleSizeTableProps,
  DataRow,
  TravelModeOption,
  AnalysisTypeOption,
  GroupedOptions,
  CountObj,
} from "../../Types";
import {
  TravelDataProvider,
  CrossSegmentDataFilter,
  TravelModeOptions,
} from "../../utils/Helpers";
import "../../css/travelpurpose.scss";
import "../../css/dropdowns.css";
import ProfileCards from "../ProfileCard/ProfileCards";
import { mean } from "d3";
import SampleSizeTable from "../../SampleSizeTable";
import RechartsLineChart from "../../LineChart/LineChart";
import Select, { SingleValue } from "react-select";
import { Colors } from "../../Colors";
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
  const [ChartData, setChartData] = useState<ChartDataProps>({
    labels: [],
    datasets: [],
  });
  const [sampleSizeTableData, setSampleSizeTableData] =
    useState<SampleSizeTableProps>({ years: [], counts: [] });
  const [dropdownOptions, setDropdownOptions] =
    useState<TravelModeOption[]>(TravelModeOptions);
  const [optionValue, setOptionValue] = useState<TravelModeOption>();
  const [analysisType, setAnalysisType] = useState<AnalysisTypeOption>({
    label: "Number of trips",
    value: "NumberTrips",
  });

  const incrementProgress = (value: number) => {
    setProgress((prev) => Math.min(prev + value, 100));
  };

  const handleDropdownValueChange = (
    selectedOption: SingleValue<TravelModeOption>
  ) => {
    setOptionValue(selectedOption as TravelModeOption);
  };

  const [chartTitle, setChartTitle] = useState<string>(
    "Average number of trips per person"
  );


  useEffect(() => {
    const allOption = TravelModeOptions.find(option => option.label === "All");
    const sortedOthers = TravelModeOptions
      .filter(option => option.label !== "All")
      .sort((a, b) => a.label.localeCompare(b.label));
    const sortedTripPurposeOptions = allOption ? [allOption, ...sortedOthers] : sortedOthers;
    
    setDropdownOptions(sortedTripPurposeOptions);  // Pass this sorted array to your dropdown
    setOptionValue(sortedTripPurposeOptions[0]);     // Optionally, set "All" as the default selection
  }, []);
  
  


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
      TravelDataProvider.getInstance(),
      startYear,
      endYear,
      week,
      toggleState
    )
      .then((FilteredData) => {
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

        setCrossSegmentFilteredData(FilteredData);

        return prepareChartData(
          FilteredData,
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

        if (analysisType.value === "NumberTrips") {
          setChartTitle("Average number of trips per person");
        } else {
          setChartTitle("Average travel duration per person (min)");
        }

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
            <label className="segment-label">Travel mode:</label>
            <Select
              className="dropdown-select"
              classNamePrefix="dropdown-select"
              value={optionValue}
              onChange={handleDropdownValueChange}
              options={dropdownOptions}
              isSearchable={true}
              menuPosition={"fixed"}
              maxMenuHeight={200}
              hideSelectedOptions={false}
            />
          </div>
          <div className="dropdown-container">
            <label className="segment-label">Metric:</label>
            <Select
              className="dropdown-select"
              classNamePrefix="dropdown-select"
              value={analysisType}
              onChange={(selectedOption) =>
                setAnalysisType(selectedOption as AnalysisTypeOption)
              }
              options={[
                { label: "Number of trips", value: "NumberTrips" },
                { label: "Travel duration", value: "TravelDuration" },
              ]}
              isSearchable={true}
              menuPosition={"fixed"}
              maxMenuHeight={120}
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
              chartData={ChartData}
              title={chartTitle}
              showLegend={true}
            />
          <Infobox>
            <p>
              {analysisType.value === "NumberTrips"
                ? "Shows the average number of trips per person per day over the analysis period for selected segment(s). Use the dropdown menu above to focus on a specific travel mode."
                : "Shows the average daily travel duration per person over the analysis period for selected segment(s). Use the dropdown menu above to focus on a specific travel mode."}
            </p>
          </Infobox>
          </div>
        </div>
        <div className="sampleSizeTable">
          <SampleSizeTable
            years={sampleSizeTableData.years}
            counts={sampleSizeTableData.counts}
            crossSegment={true}
          />
            <Infobox style={{ right : "70px"}}>
              <p>Number of respondents per year for selected segment(s).</p>
            </Infobox>
        </div>
      </div>
    </>
  );
};

const prepareChartData = (
  filteredData: DataRow[],
  menuSelectedOptions: Option[][],
  optionValue: TravelModeOption,
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

  const labels = Array.from(
    new Set(filteredData.map((item) => item.year))
  ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  menuSelectedOptions.forEach((optionsGroup, index) => {
    let dataPoints: number[] = [];
    let yearlyCounts: [string, number][] = [];

    let optionFilteredData = [...filteredData];

    const filteredDataWithConditions = optionFilteredData.filter((row) => {
      const isValidYear = row.year >= startYear && row.year <= endYear;
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
      const yearData = optionFilteredData.filter((row) => row.year === year);
      let meanValue;
      if (analysisType.value == "NumberTrips") {
        meanValue = mean(yearData, (row) => +row[optionValue.numberTrip]);
      } else {
        meanValue = mean(yearData, (row) => +row[optionValue.durationTrips]);
      }

      if (meanValue !== undefined) {
        if (analysisType.value == "NumberTrips") {
          meanValue = parseFloat(meanValue.toFixed(2));
        } else {
          meanValue = parseFloat(meanValue.toFixed(1));
        }
        dataPoints.push(meanValue);
      } else {
        dataPoints.push(0); // Push a default value if no data is available
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
      new Set(optionFilteredData.map((item) => item.year))
    ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    uniqueYears.forEach((year) => {
      yearlyCounts.push([
        year,
        optionFilteredData.filter((row) => row.year === year).length,
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
