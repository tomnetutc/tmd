import React, { useEffect } from "react";
import Select, { SingleValue } from "react-select";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import "./css/sidebar.scss";
import { analysisLevel, analysisType, weekOption, YearOption } from "./Types";
import { AnalysisLevels, AnalysisTypes, WeekOptions } from "./utils/Helpers";
import { BorderAll } from "@mui/icons-material";
import Infobox from './components/InfoBox/InfoBox';

interface SidebarProps {
  analysisLevel: analysisLevel;
  analysisType: analysisType;
  startYear: string;
  endYear: string;
  analysisDay: weekOption;
  includeDecember: boolean;
  onAnalysisLevelChange: (level: analysisLevel) => void;
  onAnalysisTypeChange: (type: analysisType) => void;
  onStartYearChange: (year: string) => void;
  onEndYearChange: (year: string) => void;
  onAnalysisDayChange: (day: weekOption) => void;
  onIncludeDecemberChange: (include: boolean) => void;
  yearOptions: YearOption[]; // Corrected type
  hideAnalysisLevels: boolean;
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
    border: "2px solid gray",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const Sidebar: React.FC<SidebarProps> = ({
  analysisLevel,
  analysisType,
  startYear,
  endYear,
  analysisDay,
  includeDecember,
  onAnalysisLevelChange,
  onAnalysisTypeChange,
  onStartYearChange,
  onEndYearChange,
  onAnalysisDayChange,
  onIncludeDecemberChange,
  yearOptions,
  hideAnalysisLevels,
}) => {
  return (
    <div className="sidebar">
      <label className="sideBarHeading">Configure Analysis</label>
      <div className="sideBarMenu">
        {hideAnalysisLevels === false ? (
          <div className="form-container">
            <div className="form-group">
            <div style={{ position: 'relative' }}>
            <label>Analysis Level</label>
            <div style={{ 
              position: 'absolute', 
              top: '-20px', 
              right: '-15px',
            }}>
              <Infobox> 
                <p>Select whether to analyze mobility patterns at the person or trip level.</p> 
              </Infobox>
            </div>
          </div>
              <Select<analysisLevel>
                options={AnalysisLevels}
                onChange={(option: SingleValue<analysisLevel>) =>
                  option && onAnalysisLevelChange(option)
                }
                value={AnalysisLevels.find(
                  (option) => option.value === analysisLevel.value
                )}
                className="dropdown"
                placeholder="Select Analysis Level"
              />
            </div>
          </div>
        ) : null}

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
                <p>Select how to analyze mobility trends. 'Between Year' compares trends across years, whereas 'Cross-Segment' shows trends between user-defined population groups.</p> 
              </Infobox>
            </div>
            </div>
            <Select<analysisType>
              options={AnalysisTypes}
              onChange={(option: SingleValue<analysisType>) =>
                option && onAnalysisTypeChange(option)
              }
              value={AnalysisTypes.find((option) => option === analysisType)}
              className="dropdown"
              placeholder="Select Analysis Type"
            />
          </div>
        </div>

        {/* Analysis Period */}
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
            <div className="year-option" style={{ alignItems: "center" }}>
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
                value={yearOptions.find((option) => option.value === startYear)}
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
                End Year
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
