import { useEffect, useState } from "react";
import { ChartDataProps, weekOption, Option, SampleSizeTableProps, DataRow, TravelModeOption, TripPurposeOption } from "../../Types";
import { TravelDataProvider, fetchAndFilterDataForBtwYearAnalysis, TravelModeOptions, TripPurposeOptions } from "../../utils/Helpers";
import "../../css/travelpurpose.scss";
import "../../css/dropdowns.css";
import { prepareVerticalChartData } from "./BtwYearDataCalculations";
import SampleSizeTable from "../../SampleSizeTable";
import RechartsLineChart from "../../LineChart/LineChart";
import Select, { MultiValue } from 'react-select';

interface BtwYearAnalysisProps {
    menuSelectedOptions: Option[];
    toggleState: boolean;
    selections: { week?: weekOption; startYear?: string; endYear?: string, includeDecember?: boolean };  // Receive selections as prop
    setIsBtwYearLoading: (isLoading: boolean) => void;
}

const BtwYearAnalysis: React.FC<BtwYearAnalysisProps> = ({
    menuSelectedOptions,
    toggleState,
    selections,
    setIsBtwYearLoading,
}) => {
    const [btwYearFilteredData, setBtwYearFilteredData] = useState<DataRow[]>([]);
    const [tripChartData, setTripChartData] = useState<ChartDataProps>({ labels: [], datasets: [] });
    const [sampleSizeTableData, setSampleSizeTableData] = useState<SampleSizeTableProps>({ years: [], counts: [] });
    const [minYear, setMinYear] = useState('');
    const [maxYear, setMaxYear] = useState('');
    const [TravelModeDropdownOptions, setTravelModeDropdownOptions] = useState<TravelModeOption[]>(TravelModeOptions);
    const [TripPurposeDropdownOptions, setTripPurposeDropdownOptions] = useState<TripPurposeOption[]>(TripPurposeOptions);
    const [TravelModeOptionValue, setTravelModeOptionValue] = useState<TravelModeOption[]>(TravelModeOptions.length > 0 ? [TravelModeOptions[0]] : []);
    const [TripPurposeOptionValue, setTripPurposeOptionValue] = useState<TravelModeOption[]>(TripPurposeOptions.length > 0 ? [TripPurposeOptions[0]] : []);
    const [isOptionDisabled, setIsOptionDisabled] = useState(false);

    // Handle dropdown value change based on selected options
    const TripPurposeHandleDropdownValueChange = (selectedOption: MultiValue<TripPurposeOption>) => {
        if (selectedOption.length === 0 && TripPurposeDropdownOptions.length > 0) {
            setTripPurposeOptionValue([TripPurposeDropdownOptions[0]]);
        } else if (selectedOption) {
            setTripPurposeOptionValue(selectedOption as TripPurposeOption[]);
        }

        setIsOptionDisabled(selectedOption.length >= 5);
    };
    const TravelModeHandleDropdownValueChange = (selectedOption: MultiValue<TravelModeOption>) => {
        if (selectedOption.length === 0 && TravelModeDropdownOptions.length > 0) {
            setTravelModeOptionValue([TravelModeDropdownOptions[0]]);
        } else if (selectedOption) {
            setTravelModeOptionValue(selectedOption as TravelModeOption[]);
        }

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

    const getTravelModeOptionDisabledState = (option: TravelModeOption) => {
        const isSelected = TravelModeOptionValue.some((selectedOption) => selectedOption.value === option.value);
        return isOptionDisabled && !isSelected;
    };

    const getTripPurposeOptionDisabledState = (option: TripPurposeOption) => {
        const isSelected = TripPurposeOptionValue.some((selectedOption) => selectedOption.value === option.value);
        return isOptionDisabled && !isSelected;
    };


    const TravelModeModifiedDropdownOptions = TravelModeDropdownOptions.map((option) => ({
        ...option,
        isDisabled: getTravelModeOptionDisabledState(option),
    }));

    const TripPurposeModifiedDropdownOptions = TripPurposeDropdownOptions.map((option) => ({
        ...option,
        isDisabled: getTripPurposeOptionDisabledState(option),
    }));


    useEffect(() => {
        const allTripModeOption = TravelModeOptions.find(option => option.label === "All");

        const sortedTripModeOptions = TravelModeOptions
            .filter(option => option.label !== "All")
            .sort((a, b) => a.label.localeCompare(b.label));

        // Trip Purpose Dropdown Options
        const travelModeDropdownOptions = allTripModeOption ? [allTripModeOption, ...sortedTripModeOptions] : sortedTripModeOptions;
        setTravelModeDropdownOptions(travelModeDropdownOptions);

        const allTripPurposeOption = TripPurposeOptions.find(option => option.label === "All");
    
        const sortedTripPurposeOptions = TripPurposeOptions
            .filter(option => option.label !== "All")
            .sort((a, b) => a.label.localeCompare(b.label));

        // Trip Purpose Dropdown Options
        const tripPurposeDropdownOptions = allTripPurposeOption ? [allTripPurposeOption, ...sortedTripPurposeOptions] : sortedTripPurposeOptions;
        setTripPurposeDropdownOptions(tripPurposeDropdownOptions);

    }, []);


    useEffect(() => {
        const { startYear, endYear, week } = selections;

        if (!startYear || !endYear || !week ) {
            return; // Wait until all selections are set
        }


        setIsBtwYearLoading(true);



        fetchAndFilterDataForBtwYearAnalysis(TravelDataProvider.getInstance(), menuSelectedOptions, week, toggleState)
            .then((btwYearFilteredData) => {
                const { tripsChartData, minYear, maxYear, sampleSizeTableData } = prepareVerticalChartData(
                    btwYearFilteredData,
                    startYear,
                    endYear,
                    selections.includeDecember,
                );
                setBtwYearFilteredData(btwYearFilteredData);
                setTripChartData(tripsChartData);
                setMinYear(minYear);
                setMaxYear(maxYear);
                setSampleSizeTableData(sampleSizeTableData);
            })

            .catch((error) => {
                console.error("Error fetching data:", error);
                setIsBtwYearLoading(false);
            })
            .finally(() => {
                setIsBtwYearLoading(false);
            });


    }, [menuSelectedOptions, selections, toggleState]);

    return (
        <>
            <div style={{ position: "relative" }}>
                {/* <div className="parent-dropdown-holder">
                    <div className="dropdown-container">
                        <label className="segment-label">Trip Purpose:</label>
                        <Select
                            className="dropdown-select"
                            classNamePrefix="dropdown-select"
                            value={TripPurposeOptionValue}
                            onChange={TripPurposeHandleDropdownValueChange}
                            options={TripPurposeModifiedDropdownOptions}
                            isSearchable={true}
                            styles={customStyles}
                            components={{ DropdownIndicator: CustomDropdownIndicator }}
                            menuPosition={'fixed'}
                            maxMenuHeight={200}
                            hideSelectedOptions={false}
                            isMulti
                        />
                    </div>

                    <div className="dropdown-container">
                        <label className="segment-label">Travel mode:</label>
                        <Select
                            className="dropdown-select"
                            classNamePrefix="dropdown-select"
                            value={TravelModeOptionValue}
                            onChange={TravelModeHandleDropdownValueChange}
                            options={TravelModeModifiedDropdownOptions}
                            isSearchable={true}
                            styles={customStyles}
                            components={{ DropdownIndicator: CustomDropdownIndicator }}
                            menuPosition={'fixed'}
                            maxMenuHeight={200}
                            hideSelectedOptions={false}
                            isMulti
                        />
                    </div>

                </div> */}


                <div className="chart-wrapper" style={{paddingTop: '0'}}>

                    {/* First chart (Number of Trips) */}
                    <div className="chart-container-1">
                        <RechartsLineChart
                            chartData={tripChartData}
                            title="Percentage of Zero-Trip makers"
                            showLegend={true}
                        />
                    </div>
                </div>
                <SampleSizeTable years={sampleSizeTableData.years} counts={sampleSizeTableData.counts} />
            </div>
        </>
    );
};

export default BtwYearAnalysis;
