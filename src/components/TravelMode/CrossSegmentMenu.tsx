import React, { useState, useEffect, useCallback } from 'react';
import { max, selection } from 'd3';
import { WeekOptions, DataProvider, AnalysisLevels, AnalysisTypes } from '../../utils/Helpers';
import { weekOption, YearOption, analysisLevel, analysisType } from '../../Types';
import Sidebar from '../../SideBar';
import "../../css/dropdowns.css";

const CrossSegmentMenu: React.FC<{ onSelectionChange: (selections: { week: weekOption, analysisLevelValue: analysisLevel, analysisTypeValue: analysisType, includeDecember: boolean, startYear: string, endYear: string}) => void,}> = ({ onSelectionChange }) => {
    const [weekValue, setWeekValue] = useState<weekOption>(WeekOptions[0]); // Defaulting to first option for demonstration
    const [analysisLevelValue, setAnalysisLevelValue] = useState<analysisLevel>(AnalysisLevels[0]); // Default analysis level
    const [analysisTypeValue, setAnalysisTypeValue] = useState<analysisType>(AnalysisTypes[1]); // Default analysis type
    const [includeDecember, setIncludeDecember] = useState<boolean>(true); // Default toggle state
    const [startYear, setStartYear] = useState<string>(new Date().getFullYear().toString());
    const [endYear, setEndYear] = useState<string>(new Date().getFullYear().toString());
    const [yearOptions, setYearOptions] = useState<YearOption[]>([]);


    // Load year options from cache or fetch data
    useEffect(() => {
        const cacheKey = "YearDataCache";
        const cachedData = localStorage.getItem(cacheKey);
        const handleDataLoad = async () => {
            const data = await DataProvider.getInstance().loadData();
            const maxYear = max(data, (d) => d.year);
            if (maxYear) {
                const expiry = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
                localStorage.setItem(cacheKey, JSON.stringify({ maxYear, expiry }));
                setYearDropdownOptions(Number(maxYear));
            }
        };

        if (cachedData) {
            const { maxYear, expiry } = JSON.parse(cachedData);
            if (new Date().getTime() < expiry) {
                setYearDropdownOptions(Number(maxYear));
                return;
            }
        }
        handleDataLoad();
    }, []);

    // Set year dropdown options and initialize startYear/endYear
    const setYearDropdownOptions = useCallback((maxYear: number) => {
        const startYear = 2003;
        const years = Array.from({ length: maxYear - startYear + 1 }, (_, i) => ({
            label: (2003 + i).toString(),
            value: (2003 + i).toString()
        }));

        setYearOptions(years);
        setStartYear("2003");
        setEndYear(maxYear.toString());
    }, []);

    // Trigger onSelectionChange whenever the year options or any of the other fields change
    useEffect(() => {
        if (yearOptions.length) {  // Ensure options are loaded
            onSelectionChange({
                week: weekValue,
                analysisLevelValue: analysisLevelValue,
                analysisTypeValue: analysisTypeValue,
                includeDecember: includeDecember,
                startYear: startYear.toString(),
                endYear: endYear.toString(),
            });
        }
    }, [weekValue, startYear, endYear, analysisLevelValue, analysisTypeValue, includeDecember, yearOptions.length, onSelectionChange]);

    return (
        <div style={{display:"flex", position:"relative"}}>
            <Sidebar 
                analysisLevel={analysisLevelValue}
                analysisType={analysisTypeValue}
                startYear={startYear.toString()}
                endYear={endYear.toString()}
                analysisDay={weekValue}
                includeDecember={includeDecember}
                onAnalysisLevelChange={setAnalysisLevelValue}
                onAnalysisTypeChange={setAnalysisTypeValue}
                onStartYearChange={setStartYear}
                onEndYearChange={setEndYear}
                onAnalysisDayChange={setWeekValue}
                onIncludeDecemberChange={setIncludeDecember}
                yearOptions={yearOptions} // Pass the year dropdown options 
            />
         </div>
    
    );
};

export default CrossSegmentMenu;
