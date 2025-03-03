import React, { useState, useCallback, useEffect } from "react";
import {
  AnalysisTypes,
  DayPatternAnalysisTypes,
  useDocumentTitle,
} from "../utils/Helpers";
import NavBar from "../Navbar";
import TopMenu from "../TopMenu";
import { Option } from "../Types";
import { weekOption, analysisLevel, analysisType } from "../Types";
import "../css/travelpurpose.scss";
import "../css/dropdowns.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is loaded if needed
import TripLevelMenu from "../components/DayPattern/TripLevelMenu";
import TripLevelAnalysis from "../components/DayPattern/TripLevelAnalysis";
import LoadingOverlay from "../components/LoadingOverlay";
import BtwYearMenu from "../components/DayPattern/BtwYearMenu";
import BtwYearAnalysis from "../components/DayPattern/BtwYearAnalysis";
import CrossSegmentMenu from "../components/DayPattern/CrossSegmentMenu";
import CrossSegmentAnalysis from "../components/DayPattern/CrossSegmentAnalysis";
import CrossSegmentTopMenu from "../components/CrossSegmentTopMenu";
import CircularProgress from "../CircularprogressBar";

interface Selections {
  week?: weekOption;
  analysisLevelValue?: analysisLevel;
  analysisTypeValue?: analysisType;
  includeDecember?: boolean;
  startYear?: string;
  endYear?: string;
}

interface DayPatternSelections {
  week?: weekOption;
  analysisTypeValue?: analysisType;
  includeDecember?: boolean;
  analysisYear?: string;
}

export default function DayPattern(): JSX.Element {
  useDocumentTitle("daypattern");
  const [currAnalysisType, setCurrAnalaysisType] = useState<analysisLevel>(
    DayPatternAnalysisTypes[0]
  );
  const [menuSelectedOptions, setMenuSelectedOptions] = useState<Option[]>([]);
  const [crossSegmentSelectedOptions, setCrossSegmentSelectedOptions] =
    useState<Option[][]>([[]]);
  const [isBtwYearLoading, setIsBtwYearLoading] = useState(true);
  const [isWithinYearLoading, setIsWithinYearLoading] = useState(true);
  const [isCrossSegmentLoading, setIsCrossSegmentLoading] = useState(true);
  const [progress, setProgress] = useState<number>(0);

  // Initialize selections state
  const [selections, setSelections] = useState<Selections>({
    week: undefined,
    analysisLevelValue: undefined,
    analysisTypeValue: undefined,
    includeDecember: undefined,
    startYear: undefined,
    endYear: undefined,
  });

  const [tripSelections, setTripSelections] = useState<DayPatternSelections>({
    week: undefined,
    analysisTypeValue: undefined,
    includeDecember: undefined,
    analysisYear: undefined,
  });

  // Callback to handle menu option changes for single selections
  const handleMenuOptionChange = useCallback(
    (options: Option[] | Option[][]) => {
      const isOptionArrayArray = Array.isArray(options[0]);

      if (!isOptionArrayArray) {
        const optionsArray = options as Option[];
        setMenuSelectedOptions((prevOptions) => {
          if (JSON.stringify(prevOptions) !== JSON.stringify(optionsArray)) {
            return optionsArray;
          }
          return prevOptions;
        });
      }
    },
    []
  );

  // Callback to update top menu selections
  const handleSelectionChange = useCallback((newSelections: Selections) => {
    setSelections((prev) => ({
      ...prev,
      ...newSelections,
    }));
    setCurrAnalaysisType((prev) => {
      if (newSelections.analysisTypeValue != undefined)
        return newSelections.analysisTypeValue;
      else return prev;
    });
  }, []);

  // Callback to update trip selections
  const handleTripSelectionChange = useCallback(
    (newSelections: DayPatternSelections) => {
      setCurrAnalaysisType((prev) => {
        if (newSelections.analysisTypeValue != undefined)
          return newSelections.analysisTypeValue;
        else return prev;
      });
      setTripSelections((prev) => ({
        ...prev,
        ...newSelections,
      }));
    },
    []
  );

  // Removes the ith entry from the cross segment selections
  const handleProfileRemove = useCallback((IRemoveIndex: number) => {
    setCrossSegmentSelectedOptions((prevOptions) => {
      const updatedOptions = prevOptions.filter(
        (_, index) => index !== IRemoveIndex + 1
      );
      return updatedOptions;
    });
  }, []);

  const handleCrossSegmentOptionSubmit = useCallback(
    (selectedOption: Option[]) => {
      setCrossSegmentSelectedOptions((prevOptions) => {
        const updatedOptions = [
          ...prevOptions,
          selectedOption.filter(Boolean) as Option[],
        ];
        return updatedOptions;
      });
    },
    []
  );

  useEffect(() => {
    if (!currAnalysisType || !currAnalysisType.value) return;

    setMenuSelectedOptions([]);
    setCrossSegmentSelectedOptions([[]]);
    setProgress(0);
  }, [currAnalysisType]);

  const renderTopMenu = () => {
    switch (currAnalysisType?.value) {
      case "withinyear":
        return (
          <>
            <TopMenu
              onOptionChange={handleMenuOptionChange}
              key={currAnalysisType.value}
            />
            <TripLevelMenu onSelectionChange={handleTripSelectionChange} />
            <div className="main-content">
              {isWithinYearLoading && <CircularProgress progress={progress} />}
              <TripLevelAnalysis
                menuSelectedOptions={menuSelectedOptions}
                toggleState={false}
                setProgress={setProgress}
                selections={tripSelections}
                setIsTripLevelAnalysisLoading={setIsWithinYearLoading}
              />
            </div>
          </>
        );
      case "betweenyear":
        return (
          <>
            <TopMenu
              onOptionChange={handleMenuOptionChange}
              key={currAnalysisType.value}
            />

            <BtwYearMenu onSelectionChange={handleSelectionChange} />
            <div className="main-content">
              {isBtwYearLoading && <CircularProgress progress={progress} />}
              <BtwYearAnalysis
                menuSelectedOptions={menuSelectedOptions}
                toggleState={false}
                selections={selections}
                setProgress={setProgress}
                setIsBtwYearLoading={setIsBtwYearLoading}
              />
            </div>
          </>
        );
      case "crosssegment":
        return (
          <>
            <CrossSegmentTopMenu
              filterOptionsForTelework={false}
              onSubmit={handleCrossSegmentOptionSubmit}
              crossSegmentSelections={crossSegmentSelectedOptions}
            />

            <CrossSegmentMenu onSelectionChange={handleSelectionChange} />
            <div className="main-content">
              {isCrossSegmentLoading && (
                <CircularProgress progress={progress} />
              )}
              <CrossSegmentAnalysis
                menuSelectedOptions={crossSegmentSelectedOptions}
                toggleState={false}
                selections={selections}
                setProgress={setProgress}
                setIsCrossSegmentLoading={setIsCrossSegmentLoading}
                onProfileRemove={handleProfileRemove}
              />
            </div>
          </>
        );

      default:
        return (
          <>
            <TopMenu onOptionChange={handleMenuOptionChange} />
            <TripLevelMenu onSelectionChange={handleTripSelectionChange} />
            <div className="main-content">
              {isWithinYearLoading && <CircularProgress progress={progress} />}
              <TripLevelAnalysis
                menuSelectedOptions={menuSelectedOptions}
                toggleState={false}
                setProgress={setProgress}
                selections={tripSelections}
                setIsTripLevelAnalysisLoading={setIsWithinYearLoading}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="app-layout">
      <NavBar />
      {/* {((currAnalysisType === DayPatternAnalysisTypes[0] &&
        isWithinYearLoading) ||
        (currAnalysisType === DayPatternAnalysisTypes[2] &&
          isCrossSegmentLoading) ||
        (currAnalysisType === DayPatternAnalysisTypes[1] &&
          isBtwYearLoading)) && <LoadingOverlay />} */}

      <div className="content-wrapper">
        <div className="content-wrapper">
          <div className="main-area">{renderTopMenu()}</div>
        </div>
      </div>
    </div>
  );
}
