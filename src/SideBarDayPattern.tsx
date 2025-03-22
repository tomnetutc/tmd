import React, { useEffect } from "react";
import Select, { SingleValue } from "react-select";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import "./css/sidebar.scss";
import { analysisLevel, analysisType, weekOption, YearOption } from "./Types";
import {
  AnalysisLevels,
  DayPatternAnalysisTypes,
  WeekOptions,
} from "./utils/Helpers";
import Infobox from './components/InfoBox/InfoBox';

interface SidebarProps {
  analysisType: analysisType;
  startYear: string;
  endYear: string;
  analysisDay: weekOption;
  analysisYear: string;
  includeDecember: boolean;
  onAnalysisTypeChange: (type: analysisType) => void;
  onStartYearChange: (year: string) => void;
  onAnalysisYearChange: (year: string) => void;
  onEndYearChange: (year: string) => void;
  onAnalysisDayChange: (day: weekOption) => void;
  onIncludeDecemberChange: (include: boolean) => void;
  yearOptions: YearOption[]; // Corrected type
  hideStartEndYear: boolean;
  hideAnalysisYear: boolean;
}

const IOSSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 3,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 3,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& + .MuiSwitch-track": {
        backgroundColor: "#198754",
        opacity: 1,
        border: "none",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 26,
    height: 26,
    boxShadow: "none",
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    border: "2px solid gray",
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const Sidebar: React.FC<SidebarProps> = ({
  analysisType,
  startYear,
  endYear,
  analysisDay,
  analysisYear,
  includeDecember,
  onAnalysisTypeChange,
  onStartYearChange,
  onEndYearChange,
  onAnalysisDayChange,
  onIncludeDecemberChange,
  onAnalysisYearChange,
  yearOptions,
  hideStartEndYear,
  hideAnalysisYear,
}) => {
  return (
    <div className="sidebar">
      <label className="sideBarHeading">Configure Analysis</label>
      <div className="sideBarMenu">
        {/* Analysis Type */}
        <div className="form-container">
          <div className="form-group">
          <div style={{ position: 'relative' }}>
            <label>Analysis Type</label>
            <div style={{ 
                  position: 'absolute', 
                  top: '-20px', 
                  right: '-15px',
                    }}>
                  <Infobox> 
                  <p>Select how to analyze day pattern trends. 'Within Year' examines patterns within a single year .'Between Year' compares trends across years, whereas 'Cross-Segment' shows trends between user-defined population groups.</p> 
                  </Infobox>
                </div>
            </div> 
            <Select<analysisType>
              options={DayPatternAnalysisTypes}
              onChange={(option: SingleValue<analysisType>) =>
                option && onAnalysisTypeChange(option)
              }
              value={DayPatternAnalysisTypes.find(
                (option) => option === analysisType
              )}
              className="dropdown"
              placeholder="Select Analysis Type"
            />
          </div>
        </div>

        {/* Analysis Period */}
        {hideStartEndYear === false ? (
          <div className="form-container">
            <div className="form-group">
            <div style={{ position: 'relative' }}>
              <label>Analysis Period</label>
              <div style={{ 
                  position: 'absolute', 
                  top: '-20px', 
                  right: '-15px',
                    }}>
                  <Infobox> 
                  <p>Select the start and end year to define the analysis period.</p> 
                  </Infobox>
                </div>
            </div> 
              <div className="year-option">
                <p
                  style={{
                    fontWeight: "normal",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                >
                  Start Year
                </p>
                <Select
                  options={yearOptions}
                  onChange={(option: SingleValue<YearOption>) =>
                    option && onStartYearChange(option.value)
                  }
                  value={yearOptions.find(
                    (option) => option.value === startYear
                  )}
                  className="dropdown"
                  placeholder="Select Year"
                />
              </div>

              <div className="year-option-2">
                <p
                  style={{
                    fontWeight: "normal",
                    marginLeft: "4px",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                >
                  End Year{" "}
                </p>
                <Select
                  options={yearOptions}
                  onChange={(option: SingleValue<YearOption>) =>
                    option && onEndYearChange(option.value)
                  }
                  value={yearOptions.find((option) => option.value === endYear)}
                  className="dropdown"
                  placeholder="Select Year"
                />
              </div>
            </div>
          </div>
        ) : null}

        {hideAnalysisYear === false ? (
          <div className="form-container">
            <div className="form-group">
            <div style={{ position: 'relative' }}>
              <label>Analysis Year</label>
              <div style={{ 
                  position: 'absolute', 
                  top: '-20px', 
                  right: '-15px',
                    }}>
                  <Infobox> 
                  <p>Select a year to view mobility trends.</p> 
                  </Infobox>
                </div>
            </div> 
              <div>
                <Select
                  options={yearOptions}
                  onChange={(option: SingleValue<YearOption>) =>
                    option && onAnalysisYearChange(option.value)
                  }
                  value={yearOptions.find(
                    (option) => option.value === analysisYear
                  )}
                  className="dropdown"
                  placeholder="Select Year"
                />
              </div>
            </div>
          </div>
        ) : null}

        {/* Analysis Day */}
        <div className="form-container">
          <div className="form-group">
          <div style={{ position: 'relative' }}>
            <label>Analysis Day</label>
            <div style={{ 
                  position: 'absolute', 
                  top: '-20px', 
                  right: '-15px',
                    }}>
                  <Infobox> 
                  <p>Select whether to analyze mobility patterns for all days, weekdays, or weekends.</p> 
                  </Infobox>
                </div>
            </div> 
            <Select<weekOption>
              options={WeekOptions}
              onChange={(option: SingleValue<weekOption>) =>
                option && onAnalysisDayChange(option)
              }
              value={WeekOptions.find((option) => option === analysisDay)}
              className="dropdown"
              placeholder="Select Analysis Day"
            />
          </div>
        </div>

        {/* Include December Switch */}
        <div className="form-container">
          <div className="form-group toggle">
          <div style={{ position: 'relative' }}>
            <p>
              Include December:{" "}
              <IOSSwitch
                checked={includeDecember}
                onChange={(event) =>
                  onIncludeDecemberChange(event.target.checked)
                }
              />
            </p>
            <div style={{ 
                position: 'absolute', 
                top: '-20px', 
                right: '-15px',
                }}>
                <Infobox> 
                  <p>Exclude or include the respondents surveyed in December from the analysis.</p> 
                </Infobox>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
