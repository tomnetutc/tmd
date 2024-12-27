import { useEffect, useState } from "react";
import { ChartDataProps, weekOption, Option, SampleSizeTableProps, DataRow, TravelModeOption, AnalysisTypeOption, GroupedOptions, CountObj} from "../../Types";
import { TravelDataProvider, CrossSegmentDataFilter, TravelModeOptions} from "../../utils/Helpers";
import "../../css/travelpurpose.scss";
import "../../css/dropdowns.css";
import ProfileCards from "../ProfileCard/ProfileCards";
import { mean } from "d3";
import SampleSizeTable from "../../SampleSizeTable";
import RechartsLineChart from "../../LineChart/LineChart";
import Select, { SingleValue } from 'react-select';
import { travel_crossSegmentColors } from "../../Colors";


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
    const [dropdownOptions, setDropdownOptions] = useState<TravelModeOption[]>(TravelModeOptions);
    const [dropdownLabel, setDropdownLabel] = useState<string>("Trip purpose");
    const [optionValue, setOptionValue] = useState<TravelModeOption>();
    const [tripPurposeDropdownOptions, setTripPurposeDropdownOptions] = useState<TravelModeOption[]>();
    const [activityLocationDropdownOptions, setActivityLocationDropdownOptions] = useState<AnalysisTypeOption[]>([]);
    const [analysisType, setAnalysisType] = useState<AnalysisTypeOption>({ label: "", value: "" });
    const [chartTitle, setChartTitle] = useState<string>("Average number of trips per person");

        // Handle dropdown value change based on selected options
        const handleDropdownValueChange = (selectedOption: SingleValue<TravelModeOption>) => {
                setOptionValue(selectedOption as TravelModeOption);
        
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
        
        const handleActivityLocationChange = (selectedOption: SingleValue<AnalysisTypeOption>) => {
            setAnalysisType(selectedOption as AnalysisTypeOption);
        };
    

        useEffect(() => {
            const allTripPurposeOption = TravelModeOptions.find(option => option.label === "All");
    
            const sortedTripPurposeOptions = TravelModeOptions
                .filter(option => option.label !== "All")
                .sort((a, b) => a.label.localeCompare(b.label));
    
            // Trip Purpose Dropdown Options
            const tripPurposeDropdownOptions = allTripPurposeOption ? [allTripPurposeOption, ...sortedTripPurposeOptions] : sortedTripPurposeOptions;

            const analysisTypeDropdownOptions = [
                { label: "Number of trips", value: "NumberTrips" },
                { label: "Travel duration", value: "TravelDuration" }
            ];

            setActivityLocationDropdownOptions(analysisTypeDropdownOptions);
            setAnalysisType(analysisTypeDropdownOptions[0]); //Default to "Number of trips" option for Analysis Type
            setTripPurposeDropdownOptions(tripPurposeDropdownOptions);
            setOptionValue(TravelModeOptions[0]);
    
        }, []);
    
    
    

    useEffect(() => {
        const { startYear, endYear, week } = selections;

        if (!startYear || !endYear || !week || !optionValue || !optionValue) {
            return; // Wait until all selections are set
        }
        setIsCrossSegmentLoading(true);

        Promise.all([
            CrossSegmentDataFilter(TravelDataProvider.getInstance(),startYear, endYear, week, toggleState)
        ]).then(([FilteredData]) => {
            setCrossSegmentFilteredData(FilteredData);
            const { chartData, sampleSizeTableData } = prepareChartData(FilteredData, menuSelectedOptions, optionValue, analysisType, startYear, endYear, selections.includeDecember);
            setChartData(chartData);
            setSampleSizeTableData(sampleSizeTableData);

            if (analysisType.value == "NumberTrips") {
                setChartTitle("Average number of trips per person");
            }
            else {
                setChartTitle("Average travel duration per person (min)");
            }

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
                    <label className="segment-label">Travel mode:</label>
                    <Select
                        className="dropdown-select"
                        classNamePrefix="dropdown-select"
                        value={optionValue}
                        onChange={handleDropdownValueChange}
                        options={dropdownOptions}
                        isSearchable={true}
                        styles={customStyles}
                        components={{ DropdownIndicator: CustomDropdownIndicator }}
                        menuPosition={'fixed'}
                        maxMenuHeight={200}
                        hideSelectedOptions={false}
                    />
                </div>
                <div className="dropdown-container">
                <label className='segment-label'>Metric:</label>
                            <Select
                                className='dropdown-select'
                                classNamePrefix='dropdown-select'
                                onMenuOpen={scrollToSelectedOption}
                                value={analysisType}
                                onChange={handleActivityLocationChange}
                                options={activityLocationDropdownOptions}
                                isSearchable={true}
                                styles={customStyles}
                                components={{ DropdownIndicator: CustomDropdownIndicator }}
                                menuPosition={'fixed'}
                                maxMenuHeight={120}
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

const prepareChartData = (filteredData: DataRow[], menuSelectedOptions: Option[][], optionValue: TravelModeOption, analysisType: AnalysisTypeOption, startYear: string, endYear: string, includeDecember: boolean | undefined): {
    chartData: ChartDataProps,
    sampleSizeTableData: SampleSizeTableProps
} => {

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
            console.log(isValidMonth);
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
            let meanValue;
            if (analysisType.value == "NumberTrips") {
                meanValue = mean(yearData, row => +row[optionValue.numberTrip]);
            }
            else {
                meanValue = mean(yearData, row => +row[optionValue.durationTrips]);
            }

            if (meanValue !== undefined) {
                if (analysisType.value == "NumberTrips") {
                    meanValue = parseFloat(meanValue.toFixed(2));
                }
                else {
                    meanValue = parseFloat(meanValue.toFixed(1));
                }
                dataPoints.push(meanValue);
            } else {
                dataPoints.push(0); // Push a default value if no data is available
            }
        });

        ChartDataSets.push({
            label: (index == 0 ? 'All' : 'Segment ' + index),
            data: dataPoints,
            borderColor: travel_crossSegmentColors[index],
            backgroundColor: travel_crossSegmentColors[index],
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
