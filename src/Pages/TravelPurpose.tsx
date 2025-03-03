import React, { useState, useCallback, useEffect } from "react";
import { useDocumentTitle } from "../utils/Helpers";
import NavBar from "../Navbar";
import TopMenu from "../TopMenu";
import { Option } from "../Types";
import { weekOption, analysisLevel, analysisType } from "../Types";
import { AnalysisLevels } from "../utils/Helpers";
import "../css/travelpurpose.scss";
import "../css/dropdowns.css";
import "bootstrap/dist/css/bootstrap.min.css";
import BtwYearMenu from "../components/TravelPurpose/BtwYearMenu";
import CrossSegmentMenu from "../components/TravelPurpose/CrossSegmentMenu";
import BtwYearAnalysis from "../components/TravelPurpose/BtwYearAnalysis";
import CrossSegmentAnalysis from "../components/TravelPurpose/CrossSegmentAnalysis";
import CrossSegmentTopMenu from "../components/CrossSegmentTopMenu";
import TripLevelMenu from "../components/TravelPurpose/TripLevelMenu";
import TripLevelAnalysis from "../components/TravelPurpose/TripLevelAnalysis";
import LoadingOverlay from "../components/LoadingOverlay";
import CircularProgress from "../CircularprogressBar";

interface Selections {
  week?: weekOption;
  analysisLevelValue?: analysisLevel;
  analysisTypeValue?: analysisType;
  includeDecember?: boolean;
  startYear?: string;
  endYear?: string;
}

interface TripSelections {
  week?: weekOption;
  analysisLevelValue?: analysisLevel;
  includeDecember?: boolean;
  analysisYear?: string;
}

export default function TravelPurpose(): JSX.Element {
  useDocumentTitle("travelpurpose");

  const [currAnalysisLevel, setCurrAnalaysisLevel] = useState<analysisLevel>(
    AnalysisLevels[0]
  );
  const [menuSelectedOptions, setMenuSelectedOptions] = useState<Option[]>([]);
  const [crossSegmentSelectedOptions, setCrossSegmentSelectedOptions] =
    useState<Option[][]>([[]]);
  const [isBtwYearLoading, setIsBtwYearLoading] = useState(true);
  const [isCrossSegmentLoading, setIsCrossSegmentLoading] = useState(true);
  const [isTripLevelAnalysisLoading, setIsTripLevelAnalysisLoading] =
    useState(true);
  const [progress, setProgress] = useState<number>(0);

  const [selections, setSelections] = useState<Selections>({
    week: undefined,
    analysisLevelValue: undefined,
    analysisTypeValue: undefined,
    includeDecember: undefined,
    startYear: undefined,
    endYear: undefined,
  });

  const [tripSelections, setTripSelections] = useState<TripSelections>({
    week: undefined,
    analysisLevelValue: undefined,
    includeDecember: undefined,
    analysisYear: undefined,
  });

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

  const handleSelectionChange = useCallback((newSelections: Selections) => {
    setSelections((prev) => ({
      ...prev,
      ...newSelections,
    }));
    setCurrAnalaysisLevel((prev) => {
      if (newSelections.analysisLevelValue != undefined)
        return newSelections.analysisLevelValue;
      else return prev;
    });
  }, []);

  const handleTripSelectionChange = useCallback(
    (newSelections: TripSelections) => {
      setCurrAnalaysisLevel((prev) => {
        if (newSelections.analysisLevelValue != undefined)
          return newSelections.analysisLevelValue;
        else return prev;
      });
      setTripSelections((prev) => ({
        ...prev,
        ...newSelections,
      }));
    },
    []
  );

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
    // Clear segment selections when switching between analysis types
    setMenuSelectedOptions([]);
    setCrossSegmentSelectedOptions([[]]);
    setProgress(0);

    // Ensure analysis type is set to "between year" when switching back to person level
    if (selections.analysisLevelValue?.value === "trip") {
      setSelections((prev) => ({
        ...prev,
        analysisTypeValue: { value: "betweenyear", label: "Between Year" },
      }));
    }
  }, [selections.analysisTypeValue, selections.analysisLevelValue]);

  return (
    <div className="app-layout">
      <NavBar />
      {/* {((currAnalysisLevel?.value === "person" &&
        ((selections.analysisTypeValue?.value === "crosssegment" &&
          isCrossSegmentLoading) ||
          (selections.analysisTypeValue?.value === "betweenyear" &&
            isBtwYearLoading))) ||
        (currAnalysisLevel?.value === "trip" &&
          isTripLevelAnalysisLoading)) && <LoadingOverlay />} */}
      <div className="content-wrapper">
        {currAnalysisLevel?.value === "person" ? (
          <div className="content-wrapper">
            {selections.analysisTypeValue?.value === "crosssegment" ? (
              <CrossSegmentTopMenu
                filterOptionsForTelework={false}
                onSubmit={handleCrossSegmentOptionSubmit}
                crossSegmentSelections={crossSegmentSelectedOptions}
              />
            ) : (
              <TopMenu onOptionChange={handleMenuOptionChange} />
            )}
            <div className="main-area">
              {selections.analysisTypeValue?.value === "crosssegment" ? (
                <CrossSegmentMenu onSelectionChange={handleSelectionChange} />
              ) : (
                <BtwYearMenu onSelectionChange={handleSelectionChange} />
              )}
              <div className="main-content">
                {selections.analysisTypeValue?.value === "crosssegment" ? (
                  <>
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
                  </>
                ) : (
                  <>
                    {isBtwYearLoading && (
                      <CircularProgress progress={progress} />
                    )}
                    <BtwYearAnalysis
                      menuSelectedOptions={menuSelectedOptions}
                      toggleState={false}
                      selections={selections}
                      setProgress={setProgress}
                      setIsBtwYearLoading={setIsBtwYearLoading}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="content-wrapper">
            <div className="main-area">
              <TopMenu onOptionChange={handleMenuOptionChange} />
              <TripLevelMenu onSelectionChange={handleTripSelectionChange} />
              <div className="main-content">
                {isTripLevelAnalysisLoading && (
                  <CircularProgress progress={progress} />
                )}
                <TripLevelAnalysis
                  menuSelectedOptions={menuSelectedOptions}
                  toggleState={false}
                  selections={tripSelections}
                  setProgress={setProgress}
                  setIsTripLevelAnalysisLoading={setIsTripLevelAnalysisLoading}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
