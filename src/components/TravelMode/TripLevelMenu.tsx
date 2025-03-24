import React, { useState, useEffect, useCallback } from "react";
import { max } from "d3";
import {
  WeekOptions,
  TripLevelDataProvider,
  AnalysisLevels,
  AnalysisTypes,
} from "../../utils/Helpers";
import {
  weekOption,
  YearOption,
  analysisLevel,
  analysisType,
} from "../../Types";
import Sidebar from "../../SideBarTripLevel";
import "../../css/dropdowns.css";

const TripLevelMenu: React.FC<{
  onSelectionChange: (tripSelections: {
    week: weekOption;
    analysisLevelValue: analysisLevel;
    analysisTypeValue: analysisType;
    includeDecember: boolean;
    analysisYear: string;
  }) => void;
}> = ({ onSelectionChange }) => {
  const [weekValue, setWeekValue] = useState<weekOption>(WeekOptions[0]); // Defaulting to first option for demonstration
  const [analysisLevelValue, setAnalysisLevelValue] = useState<analysisLevel>(
    AnalysisLevels[1]
  ); // Default analysis level
  const [analysisTypeValue, setAnalysisTypeValue] = useState<analysisType>(
    AnalysisTypes[0]
  ); // Default analysis type
  const [includeDecember, setIncludeDecember] = useState<boolean>(true); // Default toggle state
  const [analysisYear, setAnalysisYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [yearOptions, setYearOptions] = useState<YearOption[]>([]);

  // Load year options from cache or fetch data
  useEffect(() => {
    const cacheKey = "TripLevelYearDataCache2023";
    const cachedData = localStorage.getItem(cacheKey);
    const handleDataLoad = async () => {
      const data = await TripLevelDataProvider.getInstance().loadData();
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
      value: (2003 + i).toString(),
    }));

    setYearOptions(years);
    setAnalysisYear(maxYear.toString());
  }, []);

  // Trigger onSelectionChange whenever the year options or any of the other fields change
  useEffect(() => {
    if (yearOptions.length) {
      // Ensure options are loaded
      onSelectionChange({
        week: weekValue,
        analysisLevelValue: analysisLevelValue,
        analysisTypeValue: analysisTypeValue,
        includeDecember: includeDecember,
        analysisYear: analysisYear.toString(),
      });
    }
  }, [
    weekValue,
    analysisYear,
    analysisLevelValue,
    analysisTypeValue,
    includeDecember,
    yearOptions.length,
    onSelectionChange,
  ]);

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <Sidebar
        analysisLevel={analysisLevelValue}
        analysisType={analysisTypeValue}
        analysisYear={analysisYear.toString()}
        analysisDay={weekValue}
        includeDecember={includeDecember}
        onAnalysisLevelChange={setAnalysisLevelValue}
        onAnalysisYearChange={setAnalysisYear}
        onAnalysisDayChange={setWeekValue}
        onIncludeDecemberChange={setIncludeDecember}
        yearOptions={yearOptions} // Pass the year dropdown options
      />
    </div>
  );
};

export default TripLevelMenu;
