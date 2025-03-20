import { useEffect, useState } from "react";
import {
  DayPatternChartDataProps,
  PieChartDataProps,
  weekOption,
  Option,
  DataRow,
  TripPurposeOption,
} from "../../Types";
import {
  DayPatternDataProvider,
  TripLevelTripPurposeOptions,
  TripLevelDataFilter,
  getTotalRowsForYear,
} from "../../utils/Helpers";
import "../../css/travelpurpose.scss";
import "../../css/tripDropdown.css";
import { prepareVerticalChartData } from "./TripLevelDataCalculations";
import HistogramChart from "../../DayPatternCharts/DayPatternHistogram/Histogram";
import RechartsPieChart from "../../PieChart/PieChart";
import CustomSegmentDayPattern from "../DayPattern/CustomSegmentDayPattern";
import Segment from "./Segment/Segment";
import Infobox from '../InfoBox/InfoBox';
import {
  segmentSizing,
  segmentShare,
  segmentTripChains,
  updateSegmentTripChains,
  updateSegmentSize,
  updateSegmentShare,
} from "./data";

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
  const [dayPatternFilteredData, setDayPatternFilteredData] = useState<
    DataRow[]
  >([]);
  const [dayPatternChartData, setDayPatternChartData] =
    useState<DayPatternChartDataProps>({ labels: [], datasets: [] });
  const [chainCountsChartData, setChainCountsChartData] =
    useState<PieChartDataProps>({ datasets: [] });
  const [stopCountsChartData, setStopCountsChartData] =
    useState<PieChartDataProps>({ datasets: [] });
  const [dataSetLength, setDataSetLength] = useState<number>(0);
  const [avgTripChains, setAvgTripChains] = useState<number>(0);
  const [countTripChains, setCountTripChains] = useState<number>(0);
  const [avgStopPerChain, setAvgStopPerChain] = useState<number>(0);
  const [optionValue, setOptionValue] = useState<TripPurposeOption[]>(
    TripLevelTripPurposeOptions.length > 0
      ? [TripLevelTripPurposeOptions[0]]
      : []
  );
  const [segmentSize, setSegmentSize] = useState<number>(0);
  const formatter = new Intl.NumberFormat("en-US");

  const incrementProgress = (value: number) => {
    setProgress((prev) => Math.min(prev + value, 100));
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
    setOptionValue(tripPurposeDropdownOptions);
  }, []);

  useEffect(() => {
    const { analysisYear, week } = selections;
    if (!analysisYear || !week || !optionValue || optionValue.length === 0) {
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

    Promise.all([
      TripLevelDataFilter(
        DayPatternDataProvider.getInstance(),
        menuSelectedOptions,
        analysisYear,
        week,
        toggleState
      ),
      getTotalRowsForYear(DayPatternDataProvider.getInstance(), analysisYear),
    ])
      .then(([dayPatternFilteredData, totalRowsForYear]) => {
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

        const {
          DayPatternDataSet,
          TripChainsDistribution,
          ChainStopsDistribution,
          segmentSize,
          avgTripChains,
          avgStopPerChain,
          totalChainCount,
        } = prepareVerticalChartData(
          dayPatternFilteredData,
          analysisYear,
          optionValue,
          selections.includeDecember,
          "Trip purpose"
        );

        setDayPatternFilteredData(dayPatternFilteredData);
        setDayPatternChartData(DayPatternDataSet);
        setChainCountsChartData(TripChainsDistribution);
        setStopCountsChartData(ChainStopsDistribution);
        setSegmentSize(segmentSize);
        setAvgTripChains(avgTripChains);
        setAvgStopPerChain(avgStopPerChain);
        setCountTripChains(totalChainCount);

        updateSegmentSize(segmentSize);
        updateSegmentShare(dayPatternFilteredData.length, totalRowsForYear);
        updateSegmentTripChains(totalChainCount);

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
        setTimeout(() => setIsTripLevelAnalysisLoading(false), 300);
      });

    return () => clearInterval(incrementProgressSmoothly);
  }, [menuSelectedOptions, selections, toggleState, optionValue]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "95%",
            marginLeft: "2.5%",
          }}
        >
          <div className="segment-grid-container">
            <div className="box SegmentSize">
              <Segment {...segmentSizing} />
              <Infobox>
              <p>The total number of respondents in the selected segment within the year.</p>
              </Infobox>
            </div>
            <div className="box SegmentShare" style={{ position: "relative" }}>
              <Segment {...segmentShare} />
              <Infobox>
                <p>The proportion of the selected segment within the total sample for the year.</p>
              </Infobox>
            </div>
            <div className="box SegmentTripChains">
              <Segment {...segmentTripChains} />
              <Infobox>
              <p>Total number of trip chains for the selected segment. A 'trip chain' is a sequence of trips where the first trip's origin and the last trip's destination are home.</p>
              </Infobox>
            </div>
          </div>
        </div>

        <div className="chart-wrapper">
          <div className="chart-container-1">
            <HistogramChart
              chartData={dayPatternChartData}
              title="Top 15 day patterns by share (%) in the sample "
              showLegend={true}
              xAxisLabel="%"
              yAxisLabel=""
              totalCount={segmentSize}
            />
            <Infobox>
              <p>Displays the 15 most common daily travel patterns based on their share (%) in the sample. A day pattern represents the sequence of all trips (or no trips) an individual takes over a day. All patterns start and end at home for trip makers. Hover over each bar to see the decoding of pattern codes and the number of individuals with that specific pattern in the selected segment.</p>
            </Infobox>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="grid-container">
            <div>
              <div
                className="trip-parent-dropdown-holder"
                style={{ justifyContent: "center", position: "relative" }}
              >
                <CustomSegmentDayPattern
                  title="Average number of trip chains per person: "
                  segmentSize={avgTripChains.toFixed(2)}
                  unit="chains"
                />
                <Infobox>
                <p>The average number of trip chains within a day pattern for the selected segment. A trip chain consists of sequential trips that begin and end at home.</p>
                </Infobox>
              </div>

              <div className="chart-wrapper">
                <div className="chart-container-1">
                  <RechartsPieChart
                    chartData={chainCountsChartData}
                    title={`Percent of day patterns by number of trip chains (N=${new Intl.NumberFormat(
                      "en-US"
                    ).format(Number(segmentSize))} persons)`}
                    showLegend={true}
                  />
              <Infobox>
              <p>Shows the distribution of individuals based on the number of trip chains they complete in a day. Each category represents the percent of day patterns with 0, 1, 2, or 3+ trip chains in their daily patterns.</p>
              </Infobox>
                </div>
              </div>
            </div>

            <div>
              <div className="trip-parent-dropdown-holder"
                   style={{ position: "relative" }}>
                <CustomSegmentDayPattern
                  title="Average number of stops per trip chain: "
                  segmentSize={avgStopPerChain.toFixed(2)}
                  unit="stops"
                />
                <Infobox>
                <p>The average number of stops made within a trip chain for the selected segment. A stop refers to an intermediate destination before returning home.</p>
                </Infobox>
              </div>

              <div className="chart-wrapper">
                <div className="chart-container-1">
                  <RechartsPieChart
                    chartData={stopCountsChartData}
                    title={`Percent of trip chains by number of stops (N=${new Intl.NumberFormat(
                      "en-US"
                    ).format(Number(countTripChains))} chains)`}
                    showLegend={true}
                  />
                <Infobox>
                <p>Shows the distribution of trip chains based on the number of stops made. Each category represents the percent of trip chains with 0, 1, 2, or 3+ stops before returning home.</p>
                </Infobox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripLevelAnalysis;
