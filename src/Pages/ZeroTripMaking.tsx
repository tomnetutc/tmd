import React, { useState, useCallback } from "react";
import { useDocumentTitle } from "../utils/Helpers";
import NavBar from "../Navbar";
import TopMenu from "../TopMenu";
import { Option } from "../Types";
import { weekOption, analysisLevel, analysisType } from "../Types";
import "../css/travelpurpose.scss";
import "../css/dropdowns.css";
import "bootstrap/dist/css/bootstrap.min.css";
import BtwYearMenu from "../components/ZeroTripMaking/BtwYearMenu";
import CrossSegmentMenu from "../components/ZeroTripMaking/CrossSegmentMenu";
import BtwYearAnalysis from "../components/ZeroTripMaking/BtwYearAnalysis";
import CrossSegmentAnalysis from "../components/ZeroTripMaking/CrossSegmentAnalysis";
import CrossSegmentTopMenu from "../components/CrossSegmentTopMenu";
import LoadingOverlay from "../components/LoadingOverlay";
import CircularProgress from "../CircularprogressBar";

export const AnalysisLevels: analysisLevel[] = [
  {
    label: "Person",
    value: "person",
  },
];

interface Selections {
  week?: weekOption;
  analysisLevelValue?: analysisLevel;
  analysisTypeValue?: analysisType;
  includeDecember?: boolean;
  startYear?: string;
  endYear?: string;
}

export default function ZeroTripMaking(): JSX.Element {
  useDocumentTitle("zerotripmaking");

  const [currAnalysisLevel, setCurrAnalaysisLevel] = useState<analysisLevel>(
    AnalysisLevels[0]
  );
  const [menuSelectedOptions, setMenuSelectedOptions] = useState<Option[]>([]);
  const [crossSegmentSelectedOptions, setCrossSegmentSelectedOptions] =
    useState<Option[][]>([[]]);
  const [isBtwYearLoading, setIsBtwYearLoading] = useState(true);
  const [isCrossSegmentLoading, setIsCrossSegmentLoading] = useState(true);
  const [progress, setProgress] = useState<number>(0);

  const [selections, setSelections] = useState<Selections>({
    week: undefined,
    analysisLevelValue: undefined,
    analysisTypeValue: undefined,
    includeDecember: undefined,
    startYear: undefined,
    endYear: undefined,
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

  return (
    <div className="app-layout">
      <NavBar />
      {/* {((selections.analysisTypeValue?.value === "crosssegment" &&
        isCrossSegmentLoading) ||
        (selections.analysisTypeValue?.value === "betweenyear" &&
          isBtwYearLoading)) && <LoadingOverlay />} */}

      <div className="content-wrapper">
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
              {progress <= 100 && <CircularProgress progress={progress} />}
              {selections.analysisTypeValue?.value === "crosssegment" ? (
                <CrossSegmentAnalysis
                  menuSelectedOptions={crossSegmentSelectedOptions}
                  toggleState={false}
                  selections={selections}
                  setProgress={setProgress}
                  setIsCrossSegmentLoading={setIsCrossSegmentLoading}
                  onProfileRemove={handleProfileRemove}
                />
              ) : (
                <BtwYearAnalysis
                  menuSelectedOptions={menuSelectedOptions}
                  toggleState={false}
                  selections={selections}
                  setProgress={setProgress}
                  setIsBtwYearLoading={setIsBtwYearLoading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
