import { useEffect, useState } from "react";
import { DayPatternChartDataProps, PieChartDataProps, weekOption, Option, SampleSizeTableProps, DataRow, TripPurposeOption } from "../../Types";
import { DayPatternDataProvider, fetchAndFilterData, TripLevelTripPurposeOptions, WeekOptions, TripLevelDataFilter,getTotalRowsForYear } from "../../utils/Helpers";
import "../../css/travelpurpose.scss";
import "../../css/tripDropdown.css";
import { prepareVerticalChartData } from "./TripLevelDataCalculations";
import HistogramChart from "../../DayPatternCharts/DayPatternHistogram/Histogram";
import RechartsPieChart from "../../PieChart/PieChart";
import CustomSegmentDayPattern from '../DayPattern/CustomSegmentDayPattern';
import CustomSegment from "../../CustomSegment";
import Segment from "./Segment/Segment";
import {segmentSizing, segmentShare, segmentTripChains,updateSegmentTripChains, updateSegmentSize, updateSegmentShare} from "./data";

interface TripLevelAnalysisProp {
    menuSelectedOptions: Option[];
    toggleState: boolean;
    selections: { week?: weekOption; analysisYear?: string; includeDecember?: boolean };  // Receive selections as prop
    setIsTripLevelAnalysisLoading: (isLoading: boolean) => void;
}

const TripLevelAnalysis: React.FC<TripLevelAnalysisProp> = ({
    menuSelectedOptions,
    toggleState,
    selections,
    setIsTripLevelAnalysisLoading,
}) => {
    const [dayPatternFilteredData, setDayPatternFilteredData] = useState<DataRow[]>([]);
    const [dayPatternChartData, setDayPatternChartData] = useState<DayPatternChartDataProps>({ labels: [], datasets: [] });
    const [chainCountsChartData, setChainCountsChartData] = useState<PieChartDataProps>({ datasets: [] });
    const [stopCountsChartData, setStopCountsChartData] = useState<PieChartDataProps>({ datasets: [] });
    const [dataSetLength, setDataSetLength] = useState<number>(0);
    const [avgTripChains, setAvgTripChains] = useState<number>(0);
    const [countTripChains, setCountTripChains] = useState<number>(0);
    const [avgStopPerChain, setAvgStopPerChain] = useState<number>(0);
    const [optionValue, setOptionValue] = useState<TripPurposeOption[]>(TripLevelTripPurposeOptions.length > 0 ? [TripLevelTripPurposeOptions[0]] : []);
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [tripPurposeDropdownOptions, setTripPurposeDropdownOptions] = useState<TripPurposeOption[]>([]);
    const [segmentSize, setSegmentSize] = useState<number>(0);
    const formatter = new Intl.NumberFormat('en-US');


    useEffect(() => {
        const allTripPurposeOption = TripLevelTripPurposeOptions.find(option => option.label === "All");

        const sortedTripPurposeOptions = TripLevelTripPurposeOptions
            .filter(option => option.label !== "All")
            .sort((a, b) => a.label.localeCompare(b.label));

        // Trip Purpose Dropdown Options
        const tripPurposeDropdownOptions = allTripPurposeOption ? [allTripPurposeOption, ...sortedTripPurposeOptions] : sortedTripPurposeOptions;
        setTripPurposeDropdownOptions(tripPurposeDropdownOptions);

    }, []);

    useEffect(() => {
        const { analysisYear, week } = selections;

        if (!analysisYear || !week || !optionValue || optionValue.length === 0) {
            return; // Wait until all selections are set
        }


        setIsTripLevelAnalysisLoading(true);
        DayPatternDataProvider.getLength().then((length) => {
            setDataSetLength(length);
            console.log(length);
        })
        Promise.all([
            TripLevelDataFilter(DayPatternDataProvider.getInstance(), menuSelectedOptions, analysisYear, week, toggleState),
            getTotalRowsForYear(DayPatternDataProvider.getInstance(), analysisYear)
        ])
            .then(([dayPatternFilteredData, totalRowsForYear]) => {
                const { DayPatternDataSet, TripChainsDistribution, ChainStopsDistribution, segmentSize, avgTripChains, avgStopPerChain, totalChainCount } = prepareVerticalChartData(
                    dayPatternFilteredData,
                    analysisYear,
                    optionValue,
                    selections.includeDecember,
                    "Trip purpose"
                );
                setAvgTripChains(avgTripChains);
                setAvgStopPerChain(avgStopPerChain);
                setChainCountsChartData(TripChainsDistribution);
                setStopCountsChartData(ChainStopsDistribution);
                setDayPatternFilteredData(dayPatternFilteredData);
                setDayPatternChartData(DayPatternDataSet);
                setSegmentSize(segmentSize);
                setCountTripChains(totalChainCount);
                updateSegmentSize(segmentSize);
                updateSegmentShare(dayPatternFilteredData.length,totalRowsForYear);   
                updateSegmentTripChains(totalChainCount); 
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setIsTripLevelAnalysisLoading(false);
            })
            .finally(() => {
                setIsTripLevelAnalysisLoading(false);
            });
    }, [menuSelectedOptions, selections, toggleState, optionValue]);  // Added optionValue as dependency

    return (
        <>
            <div style={{ position: "relative" }}>
                <div style={{display:"flex", justifyContent: "center", width:"95%", marginLeft:"2.5%"}}>
                <div className="segment-grid-container">
                <div className="box SegmentSize"><Segment {...segmentSizing} /></div>
                <div className="box SegmentShare"><Segment {...segmentShare} /></div>
                <div className="box SegmentTripChains"><Segment {...segmentTripChains} /></div>
                {/* <div className="trip-parent-dropdown-holder">
                    <CustomSegment title="Segment Size : " segmentSize={formatter.format(segmentSize)} unit="people" />
                </div>
                <div className="trip-parent-dropdown-holder">
                    <CustomSegment title="Segment Percentage : " segmentSize={formatter.format(Number((segmentSize*100/dataSetLength).toFixed(2)))} unit="%" />
                </div>
                <div className="trip-parent-dropdown-holder">
                    <CustomSegment title="Segment Percentage : " segmentSize={formatter.format(countTripChains)} unit="chains" />
                </div> */}
                </div>

                </div>
                
                <div className="chart-wrapper">

                    {/* First chart (Number of Trips) */}
                    <div className="chart-container-1">
                        <HistogramChart
                            chartData={dayPatternChartData}
                            title="Top 15 day patterns by share in the sample (%)"
                            showLegend={true}
                            xAxisLabel="%"
                            yAxisLabel=""
                            totalCount={segmentSize}
                        />
                    </div>

                </div>
                <div style={{display:"flex",justifyContent: "center"}}>
                <div className="grid-container">
                    <div>
                    <div className="trip-parent-dropdown-holder" style={{justifyContent:"center"}}>
                        <CustomSegmentDayPattern  title="Average number of trip chains per person: " segmentSize={formatter.format(parseFloat(avgTripChains.toFixed(2)))} unit="" />
                    </div>

                    <div className="chart-wrapper">
                    <div className="chart-container-1">
                        <RechartsPieChart
                            chartData={chainCountsChartData}
                            title={"Percent of day patterns by number of trip chains (N=" + segmentSize + " persons)"}
                            showLegend={true}
                        />
                    </div>
                </div>

                    </div>

                    <div>
                    <div className="trip-parent-dropdown-holder">
                        <CustomSegmentDayPattern title="Average number of stops per trip chain: " segmentSize={formatter.format(parseFloat(avgStopPerChain.toFixed(2)))} unit="" />
                    </div>


                    <div className="chart-wrapper">
                        <div className="chart-container-1">
                            <RechartsPieChart
                                chartData={stopCountsChartData}
                                title={"Percent of trip chains by number of stops (N=" + countTripChains + " chains)"}
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
