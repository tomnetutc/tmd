import React from "react";
import Select, { SingleValue } from "react-select";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import "./css/sidebar.scss";
import { analysisLevel, analysisType, weekOption, YearOption } from "./Types";
import { AnalysisLevels, AnalysisTypes, WeekOptions } from "./utils/Helpers";
import Infobox from './components/InfoBox/InfoBox';
interface SidebarProps {
  analysisLevel: analysisLevel;
  analysisType: analysisType;
  analysisYear: string;
  analysisDay: weekOption;
  includeDecember: boolean;
  onAnalysisLevelChange: (level: analysisLevel) => void;
  onAnalysisYearChange: (year: string) => void;
  onAnalysisDayChange: (day: weekOption) => void;
  onIncludeDecemberChange: (include: boolean) => void;
  yearOptions: YearOption[]; // Corrected type
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
  analysisLevel,
  analysisType,
  analysisYear,
  analysisDay,
  includeDecember,
  onAnalysisLevelChange,
  onAnalysisYearChange,
  onAnalysisDayChange,
  onIncludeDecemberChange,
  yearOptions, // Corrected use of yearOptions
}) => {
  return (
    <div className="sidebar">
      <label className="sideBarHeading">Configure Analysis</label>
      <div className="sideBarMenu">
        {/* Analysis Level */}
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
              value={AnalysisLevels.find((option) => option === analysisLevel)}
              className="dropdown"
              placeholder="Select Analysis Level"
            />
          </div>
        </div>

        {/* Analysis Period */}
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
                  <p>Exclude or include the respondents’ trips in December from the analysis.</p> 
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
