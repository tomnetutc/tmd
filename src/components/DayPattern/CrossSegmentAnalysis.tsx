import { useEffect, useState } from "react";
import { ChartDataProps, weekOption, Option, SampleSizeTableProps, DataRow, DayPatternOption, AnalysisTypeOption, GroupedOptions, CountObj} from "../../Types";
import { DayPatternDataProvider, CrossSegmentDataFilter, DayPatternOptions} from "../../utils/Helpers";
import "../../css/travelpurpose.scss";
import "../../css/dropdowns.css";
import ProfileCards from "../ProfileCard/ProfileCards";
import { mean } from "d3";
import SampleSizeTable from "../../SampleSizeTable";
import RechartsLineChart from "../../LineChart/LineChart";
import Select, { SingleValue } from 'react-select';
import { Colors } from "../../Colors";
import CustomOption from "./ToolTipOptionSingleSelect"; 

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
    const [dropdownOptions, setDropdownOptions] = useState<DayPatternOption[]>();
    const [dropdownLabel, setDropdownLabel] = useState<string>("Day Pattern");
    const [optionValue, setOptionValue] = useState<DayPatternOption>();
    const [tripPurposeDropdownOptions, setTripPurposeDropdownOptions] = useState<DayPatternOption[]>();
    const [activityLocationDropdownOptions, setActivityLocationDropdownOptions] = useState<AnalysisTypeOption[]>([]);
    const [analysisType, setAnalysisType] = useState<AnalysisTypeOption>({ label: "", value: "" });
    const [chartTitle, setChartTitle] = useState<string>("Share of trip chains (%) by segment");

        // Handle dropdown value change based on selected options
        const handleDropdownValueChange = (selectedOption: SingleValue<DayPatternOption>) => {
                setOptionValue(selectedOption as DayPatternOption);
        
        };

        const customStyles = {
            control: (provided: any) => ({
                ...provided,
                minHeight: '36px',
                fontSize: '14px',
            }),
        };
    
        const CustomDropdownIndicator: React.FC<{}> = () => (
            <div className="dropdown-indicator">
                <svg width="15" height="15" fill="currentColor" className="bi bi-chevron-down" viewBox="-2 -2 21 21">
                    <path
                        fillRule="evenodd"
                        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    />
                </svg>
            </div>
        );
            


        useEffect(() => {
            const allTripPurposeOption = DayPatternOptions.find(option => option.label === "H-W-H");
        
            const sortedTripPurposeOptions = DayPatternOptions
                .filter(option => option.label !== "0") 
                .sort((a, b) => a.label.length - b.label.length); // Sorting strictly based on label length

            console.log(sortedTripPurposeOptions);
                
            const analysisTypeDropdownOptions = [
                { label: "Number of trips", value: "NumberTrips" },
                { label: "Travel duration", value: "TravelDuration" }
            ];
        
            setActivityLocationDropdownOptions(analysisTypeDropdownOptions);
            setAnalysisType(analysisTypeDropdownOptions[0]); // Default to "Number of trips"
            setTripPurposeDropdownOptions(sortedTripPurposeOptions);
            setDropdownOptions(sortedTripPurposeOptions);
            setOptionValue(DayPatternOptions[0]);
        
        }, []);
            
    
    

    useEffect(() => {
        const { startYear, endYear, week } = selections;

        if (!startYear || !endYear || !week || !optionValue || !optionValue) {
            return; // Wait until all selections are set
        }
        setIsCrossSegmentLoading(true);

        Promise.all([
            CrossSegmentDataFilter(DayPatternDataProvider.getInstance(),startYear, endYear, week, toggleState)
        ]).then(([FilteredData]) => {
            setCrossSegmentFilteredData(FilteredData);
            const { chartData, sampleSizeTableData } = prepareChartData(FilteredData, menuSelectedOptions, optionValue, analysisType, startYear, endYear, selections.includeDecember);
            setChartData(chartData);
            setSampleSizeTableData(sampleSizeTableData);
        }).finally(() => {
            setIsCrossSegmentLoading(false);
        });
    }, [menuSelectedOptions, selections, toggleState, optionValue, analysisType]);  // Added optionValue as dependency

    const scrollToSelectedOption = () => {
        setTimeout(() => {
            const selectedEl = document.querySelector(".dropdown-select__option--is-selected");
            if (selectedEl) {
                selectedEl.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
            }
        }, 15);
    };
    

    return (
        <>
        <div style={{position: "relative"}}>
        <div className="parent-dropdown-holder"> 
        <div className="dropdown-container">
                    <label className="segment-label">Day Pattern:</label>
                    <Select
    className="dropdown-select"
    classNamePrefix="dropdown-select"
    value={optionValue} // ✅ Single object or null
    onChange={handleDropdownValueChange} // ✅ Correct function for single select
    options={dropdownOptions}
    isSearchable={true}
    styles={customStyles}
    components={{ 
        // Use the custom Option here
        Option: CustomOption,
        DropdownIndicator: CustomDropdownIndicator 
      }}
menuPosition={'fixed'}
    maxMenuHeight={200}
    hideSelectedOptions={false}
/>
                </div>
        </div>

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
                            yAxisLabel="(%)"
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

const prepareChartData = (filteredData: DataRow[], menuSelectedOptions: Option[][], optionValue: DayPatternOption, analysisType: AnalysisTypeOption, startYear: string, endYear: string, includeDecember: boolean | undefined): {
    chartData: ChartDataProps,
    sampleSizeTableData: SampleSizeTableProps
} => {

    type ChartDataType = ChartDataProps['datasets'][number];

    let ChartDataSets: ChartDataType[] = [];
    let sampleSizeCounts: CountObj[] = [];

    const filteredByYearData = filteredData.filter(dataRow => {
        const year = parseInt(dataRow['year'], 10);
        return year >= Number(startYear) && year <= Number(endYear);
    });

    const labels = Array.from(
        new Set(filteredByYearData.map(item => parseInt(item.year, 10))) // Convert to integer first
    ).sort((a, b) => a - b) // Ensure numeric sorting
     .map(year => year.toString()); // Convert back to string
    menuSelectedOptions.forEach((optionsGroup, index) => {

        let dataPoints: number[] = [];
        let yearlyCounts: [string, number][] = [];

        let optionFilteredData = [...filteredData];
        console.log(optionValue);

        const filteredDataWithConditions = optionFilteredData.filter(row => {
            const isValidYear = parseInt(row.year).toString() >= startYear && parseInt(row.year).toString() <= endYear;
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
            const yearData = optionFilteredData.filter(row => parseInt(row.year).toString() === year);
        
            const filteredYearData = yearData.filter(row => row.day_pattern === optionValue.label);
        
            let meanValue;
            if (analysisType.value == "NumberTrips") {
                meanValue = filteredYearData.length/yearData.length;
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
            label: (index == 0 ? 'All' : 'Segment ' + index),
            data: dataPoints,
            borderColor: Colors[index],
            backgroundColor: Colors[index],
            barThickness: 'flex',
        });

        const uniqueYears = Array.from(
            new Set(filteredByYearData.map(item => parseInt(item.year, 10))) // Convert to integer first
        ).sort((a, b) => a - b) // Ensure numeric sorting
         .map(year => year.toString()); // Convert back to string
    
        uniqueYears.forEach(year => {
            yearlyCounts.push([year, optionFilteredData.filter(row => parseInt(row.year).toString() === year).length]);
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
