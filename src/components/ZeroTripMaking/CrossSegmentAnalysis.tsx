import { useEffect, useState } from "react";
import { ChartDataProps, weekOption, Option, SampleSizeTableProps, DataRow, TravelModeOption, GroupedOptions, CountObj} from "../../Types";
import { TravelDataProvider, CrossSegmentDataFilter} from "../../utils/Helpers";
import "../../css/travelpurpose.scss";
import "../../css/dropdowns.css";
import ProfileCards from "../ProfileCard/ProfileCards";
import { mean } from "d3";
import SampleSizeTable from "../../SampleSizeTable";
import RechartsLineChart from "../../LineChart/LineChart";
import { Colors } from "../../Colors";


interface CrossSegmentAnalysisProps {
    menuSelectedOptions: Option[][];
    toggleState: boolean;
    selections: { week?: weekOption; startYear?: string; endYear?: string, includeDecember?: boolean };  // Receive selections as prop
    setIsCrossSegmentLoading: (isLoading: boolean) => void;
    onProfileRemove: (index: number) => void ;
}

const CrossSegmentAnalysis: React.FC<CrossSegmentAnalysisProps> = ({
    menuSelectedOptions,
    toggleState,
    selections,
    setIsCrossSegmentLoading,
    onProfileRemove
}) => {
    const [crossSegmentFilteredData, setCrossSegmentFilteredData] = useState<DataRow[]>([]);
    const [ChartData, setChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [sampleSizeTableData, setSampleSizeTableData] = useState<SampleSizeTableProps>({ years: [], counts: [] });
    const [optionValue, setOptionValue] = useState<TravelModeOption>();
    const [chartTitle, setChartTitle] = useState<string>("Percent of Zero-Trip Makers (%)");
    
    

    useEffect(() => {
        const { startYear, endYear, week } = selections;

        if (!startYear || !endYear || !week) {
            return; // Wait until all selections are set
        }
        setIsCrossSegmentLoading(true);

        Promise.all([
            CrossSegmentDataFilter(TravelDataProvider.getInstance(),startYear, endYear, week, toggleState)
        ]).then(([FilteredData]) => {
            setCrossSegmentFilteredData(FilteredData);
            const { chartData, sampleSizeTableData } = prepareChartData(FilteredData, menuSelectedOptions, startYear, endYear, selections.includeDecember);
            setChartData(chartData);
            setSampleSizeTableData(sampleSizeTableData);

        }).finally(() => {
            setIsCrossSegmentLoading(false);
        });
    }, [menuSelectedOptions, selections, toggleState]);
    

    return (
        <>
        <div style={{position: "relative"}}>
        </div>
            <div className='home'>
                <div className="chart-wrapper">
                    <div className="chart-container-1">
                        <ProfileCards
                            profileList={menuSelectedOptions.filter(optionsArray => optionsArray.length > 0).map(optionsArray => ({
                                'profile': optionsArray
                            }))}
                            removeProfile={(index: number) => onProfileRemove(index)}
                            title="Segments"
                        />
                    </div>
                    <div className='chart-container-1'>
                        <RechartsLineChart
                            chartData={ChartData}
                            title={chartTitle}
                            showLegend={true}
                        />
                    </div>
                </div>
                <div className="sampeSizeTable">
                    <SampleSizeTable years={sampleSizeTableData.years} counts={sampleSizeTableData.counts} crossSegment={true} />
                </div>
            </div>
        </>

    )
}

const prepareChartData = (filteredData: DataRow[], menuSelectedOptions: Option[][], startYear: string, endYear: string, includeDecember: boolean | undefined): {
    chartData: ChartDataProps,
    sampleSizeTableData: SampleSizeTableProps
} => {

    console.log("hello");
    type ChartDataType = ChartDataProps['datasets'][number];

    let ChartDataSets: ChartDataType[] = [];
    let sampleSizeCounts: CountObj[] = [];

    const labels = Array.from(new Set(filteredData.map(item => item.year))).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    menuSelectedOptions.forEach((optionsGroup, index) => {

        let dataPoints: number[] = [];
        let yearlyCounts: [string, number][] = [];

        let optionFilteredData = [...filteredData];

        const filteredDataWithConditions = optionFilteredData.filter(row => {
            const isValidYear = row.year >= startYear && row.year <= endYear;
            const isValidMonth = includeDecember || parseInt(row.month, 10) !== 12;
            return isValidYear && isValidMonth;
        });
        

        optionFilteredData = filteredDataWithConditions.filter(row => {
            // Group options by groupId
            const groupedOptions = optionsGroup.reduce((acc: GroupedOptions, option) => {
                const groupId = option.groupId;
                acc[groupId] = acc[groupId] || [];
                acc[groupId].push(option);
                return acc;
            }, {});


            return Object.values(groupedOptions).every((group: Option[]) => {
                return group.some(option => {
                    const column = option.id;
                    const value = option.val;
                    return row[column] === value;
                });
            });
        });

        labels.forEach(year => {
            const yearData = optionFilteredData.filter(row => row.year === year);
            const totalEntries = yearData.length;
            const zeroTripCount = yearData.filter(row => +row['zero_trip'] === 1).length;
        
            if (totalEntries > 0) {
                const zeroTripPercentage = (zeroTripCount / totalEntries) * 100; // Calculate percentage
                dataPoints.push(parseFloat(zeroTripPercentage.toFixed(1))); // Push rounded percentage
            } else {
                dataPoints.push(0); // Push a default value if no data is available
            }
        });
        
        ChartDataSets.push({
            label: (index == 0 ? 'All' : 'Segment ' + index),
            data: dataPoints,
            borderColor: Colors[index],
            backgroundColor: Colors[index],
            barThickness: 'flex',
        });

        const uniqueYears = Array.from(new Set(optionFilteredData.map(item => item.year)))
            .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

        uniqueYears.forEach(year => {
            yearlyCounts.push([year, optionFilteredData.filter(row => row.year === year).length]);
        });

        sampleSizeCounts.push({ data: optionFilteredData, count: yearlyCounts });
    });


    return {
        chartData: {
            labels: labels,
            datasets: ChartDataSets
        },
        sampleSizeTableData: {
            years: labels,
            counts: sampleSizeCounts
        }
    };

};
export default CrossSegmentAnalysis;
