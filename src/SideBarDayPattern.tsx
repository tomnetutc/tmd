import React, { useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import './css/sidebar.scss';
import { analysisLevel, analysisType, weekOption, YearOption } from './Types';
import { AnalysisLevels, DayPatternAnalysisTypes, WeekOptions } from './utils/Helpers';


interface SidebarProps {
    analysisType: analysisType;
    startYear: string;
    endYear: string;
    analysisDay: weekOption;
    analysisYear: string
    includeDecember: boolean;
    onAnalysisTypeChange: (type: analysisType) => void;
    onStartYearChange: (year: string) => void;
    onAnalysisYearChange: (year: string) => void;
    onEndYearChange: (year: string) => void;
    onAnalysisDayChange: (day: weekOption) => void;
    onIncludeDecemberChange: (include: boolean) => void;
    yearOptions: YearOption[];  // Corrected type
    hideStartEndYear: boolean;
    hideAnalysisYear: boolean;
}


const IOSSwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 3,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 3,
        transform: 'translateX(6px)',
        transition: theme.transitions.create(['transform', 'color'], {
            duration: 300,
        }),
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            transition: theme.transitions.create(['transform', 'color'], {
                duration: 300,
            }),
            '& + .MuiSwitch-track': {
                backgroundColor: '#65C466',
                opacity: 1,
                border: 'none',
                transition: theme.transitions.create(['background-color', 'opacity'], {
                    duration: 300,
                }),
            },
        },
    },
    '& .MuiSwitch-thumb': {
        width: 26,
        height: 26,
        boxShadow: 'none',
        transition: theme.transitions.create(['width', 'height'], {
            duration: 300,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: '#E9E9EA',
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'opacity'], {
            duration: 300,
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
    hideAnalysisYear
}) => {
    return (
        <div className="sidebar">
            <div className="sideBarMenu">
                {/* Analysis Type */}
                <div className='form-container'>
                    <div className="form-group">
                        <label>Analysis Type</label>
                        <Select<analysisType>
                            options={DayPatternAnalysisTypes}
                            onChange={(option: SingleValue<analysisType>) => option && onAnalysisTypeChange(option)}
                            value={DayPatternAnalysisTypes.find(option => option === analysisType)}
                            className="dropdown"
                            placeholder="Select Analysis Type"
                        />
                    </div>
                </div>

                {/* Analysis Period */}
                {hideStartEndYear === false ? (

                    <div className='form-container'>
                        <div className="form-group">
                            <label>Analysis Period</label>
                            <div className='year-option'>
                                <p style={{ fontWeight: 'normal' }}>Start Year</p>
                                <Select
                                    options={yearOptions}
                                    onChange={(option: SingleValue<YearOption>) => option && onStartYearChange((option.value))}
                                    value={yearOptions.find(option => (option.value) === startYear)}
                                    className="dropdown"
                                    placeholder="Select Year"
                                />
                            </div>

                            <div className='year-option-2'>
                                <p style={{ fontWeight: 'normal', marginRight: '4px' }}>End Year </p>
                                <Select
                                    options={yearOptions}
                                    onChange={(option: SingleValue<YearOption>) => option && onEndYearChange((option.value))}
                                    value={yearOptions.find(option => (option.value) === endYear)}
                                    className="dropdown"
                                    placeholder="Select Year"
                                />
                            </div>
                        </div>
                    </div>) :
                    null}

                {hideAnalysisYear === false ? (
                    <div className='form-container'>
                        <div className="form-group">
                            <label>Analysis Year</label>
                            <div>
                                <Select
                                    options={yearOptions}
                                    onChange={(option: SingleValue<YearOption>) => option && onAnalysisYearChange((option.value))}
                                    value={yearOptions.find(option => (option.value) === analysisYear)}
                                    className="dropdown"
                                    placeholder="Select Year"
                                />
                            </div>
                        </div>
                    </div>) :
                    null}

                {/* Analysis Day */}
                <div className='form-container'>
                    <div className="form-group">
                        <label>Analysis Day</label>
                        <Select<weekOption>
                            options={WeekOptions}
                            onChange={(option: SingleValue<weekOption>) => option && onAnalysisDayChange(option)}
                            value={WeekOptions.find(option => option === analysisDay)}
                            className="dropdown"
                            placeholder="Select Analysis Day"
                        />
                    </div>
                </div>

                {/* Include December Switch */}
                <div className='form-container'>
                    <div className="form-group toggle">
                        <p>Include December: <IOSSwitch checked={includeDecember} onChange={(event) => onIncludeDecemberChange(event.target.checked)} /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
