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

    setIsTripLevelAnalysisLoading(true);
    setProgress(0);
    incrementProgress(10);

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
        setTimeout(() => incrementProgress(30), 300);

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
            </div>
            <div className="box SegmentShare">
              <Segment {...segmentShare} />
            </div>
            <div className="box SegmentTripChains">
              <Segment {...segmentTripChains} />
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
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="grid-container">
            <div>
              <div
                className="trip-parent-dropdown-holder"
                style={{ justifyContent: "center" }}
              >
                <CustomSegmentDayPattern
                  title="Average number of trip chains per person: "
                  segmentSize={formatter.format(
                    parseFloat(avgTripChains.toFixed(2))
                  )}
                  unit=""
                />
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
                </div>
              </div>
            </div>

            <div>
              <div className="trip-parent-dropdown-holder">
                <CustomSegmentDayPattern
                  title="Average number of stops per trip chain: "
                  segmentSize={formatter.format(
                    parseFloat(avgStopPerChain.toFixed(2))
                  )}
                  unit=""
                />
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
