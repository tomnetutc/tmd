import { useEffect, useState } from "react";
import { TripChartDataProps, weekOption, Option, SampleSizeTableProps, DataRow, TripPurposeOption } from "../../Types";
import { TripLevelDataProvider, fetchAndFilterData, TripLevelTripPurposeOptions, WeekOptions, TripLevelDataFilter } from "../../utils/Helpers";
import "../../css/travelpurpose.scss";
import "../../css/dropdowns.css";
import { prepareVerticalChartData } from "./TripLevelDataCalculations";
import SampleSizeTable from "../../SampleSizeTable";
import HistogramChart from "../../Histogram/Histogram";
import Select, { MultiValue } from 'react-select';
import { Table } from "react-bootstrap";
import { relative } from "path";
import { Area, AreaChart } from "recharts";
import AreaChartComponent from "../../AreaChart/AreaChart";

interface TripLevelAnalysisProp {
    menuSelectedOptions: Option[];
    toggleState: boolean;
    selections: { week?: weekOption; analysisYear?: string; includeDecember?: boolean};  // Receive selections as prop
    setIsTripLevelAnalysisLoading: (isLoading: boolean) => void;
}

const TripLevelAnalysis: React.FC<TripLevelAnalysisProp> = ({
    menuSelectedOptions,
    toggleState,
    selections,
    setIsTripLevelAnalysisLoading,
}) => {
    const [tripLevelFilteredData, setTripLevelFilteredData] = useState<DataRow[]>([]);
    const [tripDurationChartData, setTripDurationChartData] = useState<TripChartDataProps>({ labels: [], datasets: [] });
    const [tripStartChartData, setTripStartChartData] = useState<TripChartDataProps>({ labels: [], datasets: [] });
    const [tripModeDistributionChartData, setTripModeDistributionChartData] = useState<TripChartDataProps>({ labels: [], datasets: [] });
    const [dropdownOptions, setDropdownOptions] = useState<TripPurposeOption[]>(TripLevelTripPurposeOptions);
    const [optionValue, setOptionValue] = useState<TripPurposeOption[]>(TripLevelTripPurposeOptions.length > 0 ? [TripLevelTripPurposeOptions[0]] : []);
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);
    const [tripPurposeDropdownOptions, setTripPurposeDropdownOptions] = useState<TripPurposeOption[]>([]);

    // Handle dropdown value change based on selected options
    const handleDropdownValueChange = (selectedOption: MultiValue<TripPurposeOption>) => {
        if (selectedOption.length === 0 && tripPurposeDropdownOptions.length > 0) {
            setOptionValue([tripPurposeDropdownOptions[0]]);
        } else if (selectedOption) {
            setOptionValue(selectedOption as TripPurposeOption[]);
        }

        console.log(optionValue);

        setIsOptionDisabled(selectedOption.length >= 5);
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

    const getOptionDisabledState = (option: TripPurposeOption) => {
        const isSelected = optionValue.some((selectedOption) => selectedOption.value === option.value);
        return isOptionDisabled && !isSelected;
    };

    const modifiedDropdownOptions = dropdownOptions.map((option) => ({
        ...option,
        isDisabled: getOptionDisabledState(option),
    }));

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

        TripLevelDataFilter(TripLevelDataProvider.getInstance(), menuSelectedOptions, analysisYear, week, toggleState)
            .then((tripLevelFilteredData) => {
                const { tripsDurationChartData, tripStartTimeChartData, tripModeDistributionChartData } = prepareVerticalChartData(
                    tripLevelFilteredData,
                    analysisYear,
                    optionValue,
                    selections.includeDecember,
                    "Trip purpose"
                );
                setTripLevelFilteredData(tripLevelFilteredData);
                setTripDurationChartData(tripsDurationChartData);
                setTripModeDistributionChartData(tripModeDistributionChartData);
                setTripStartChartData(tripStartTimeChartData);
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
                <div className="parent-dropdown-holder">
                    <div className="dropdown-container">
                        <label className="segment-label">Trip purpose:</label>
                        <Select
                            className="dropdown-select"
                            classNamePrefix="dropdown-select"
                            value={optionValue}
                            onChange={handleDropdownValueChange}
                            options={modifiedDropdownOptions}
                            isSearchable={true}
                            styles={customStyles}
                            components={{ DropdownIndicator: CustomDropdownIndicator }}
                            menuPosition={'fixed'}
                            maxMenuHeight={200}
                            hideSelectedOptions={false}
                            isMulti
                        />
                    </div>
                </div>
                <div className="chart-wrapper">


                    {/* First chart (Number of Trips) */}
                    <div className="chart-container-1">
                        <HistogramChart
                            chartData={tripDurationChartData}
                            title="Duration Histogram"
                            showLegend={true}
                        />
                    </div>

                </div>
                <div className="chart-wrapper">


                    {/* First chart (Number of Trips) */}
                    <div className="chart-container-1">
                        <AreaChartComponent
                            chartData={tripStartChartData}
                            title="Temporal Distribution"
                            showLegend={true}
                        />
                    </div>

                </div>

                <div className="chart-wrapper">


{/* First chart (Number of Trips) */}
<div className="chart-container-1">
    <HistogramChart
        chartData={tripModeDistributionChartData}
        title="Mode Distribution"
        showLegend={true}
    />
</div>

</div>


            </div>
        </>
    );
};

export default TripLevelAnalysis;
