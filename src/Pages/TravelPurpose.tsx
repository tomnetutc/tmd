import React, { useState, useCallback, useEffect } from 'react';
import { useDocumentTitle } from '../utils/Helpers';
import NavBar from '../Navbar';
import TopMenu from '../TopMenu';
import { Option } from '../Types';
import { weekOption, analysisLevel, analysisType } from '../Types';
import { AnalysisLevels } from '../utils/Helpers';
import '../css/travelpurpose.scss';
import '../css/dropdowns.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is loaded if needed
import BtwYearMenu from '../components/TravelPurpose/BtwYearMenu';
import CrossSegmentMenu from '../components/TravelPurpose/CrossSegmentMenu';
import BtwYearAnalysis from '../components/TravelPurpose/BtwYearAnalysis';
import CrossSegmentAnalysis from '../components/TravelPurpose/CrossSegmentAnalysis';
import CrossSegmentTopMenu from '../components/CrossSegmentTopMenu';
import TripLevelMenu from '../components/TravelPurpose/TripLevelMenu';
import TripLevelAnalysis from '../components/TravelPurpose/TripLevelAnalysis';

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
    useDocumentTitle('Telework');
    const [currAnalysisLevel, setCurrAnalaysisLevel]= useState<analysisLevel>(AnalysisLevels[0]);
    const [menuSelectedOptions, setMenuSelectedOptions] = useState<Option[]>([]);
    const [crossSegmentSelectedOptions, setCrossSegmentSelectedOptions] = useState<Option[][]>([[]]);

    // Initialize selections state
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

    // Callback to handle menu option changes for single selections
    const handleMenuOptionChange = useCallback((options: Option[] | Option[][]) => {
        const isOptionArrayArray = Array.isArray(options[0]);

        if (!isOptionArrayArray) {
            const optionsArray = options as Option[];
            setMenuSelectedOptions(prevOptions => {
                if (JSON.stringify(prevOptions) !== JSON.stringify(optionsArray)) {
                    console.log("Menu options updated:", optionsArray);
                    return optionsArray;
                }
                return prevOptions;
            });

        }
    }, []);

    // Callback to update top menu selections
    const handleSelectionChange = useCallback((newSelections: Selections) => {
        setSelections(prev => ({
            ...prev,
            ...newSelections
        }));
        setCurrAnalaysisLevel(prev => {
            console.log(newSelections);
            if(newSelections.analysisLevelValue != undefined)
                return newSelections.analysisLevelValue;
            else return prev;
        });
        }, []);

    // Callback to update trip selections
    const handleTripSelectionChange = useCallback((newSelections: TripSelections) => {
        setCurrAnalaysisLevel(prev => {
            console.log(newSelections.analysisLevelValue);
            if(newSelections.analysisLevelValue != undefined)
                return newSelections.analysisLevelValue;
            else return prev;
        });
        setTripSelections(prev => ({
            ...prev,
            ...newSelections
        }));
    }, []);

    // Removes the ith entry from the cross segment selections
    const handleProfileRemove = useCallback((IRemoveIndex: number) => {
        console.log(IRemoveIndex);
        setCrossSegmentSelectedOptions(prevOptions => {
            const updatedOptions = prevOptions.filter((_, index) => index !== IRemoveIndex + 1);
            return updatedOptions;
        });
    }, []);

    const handleCrossSegmentOptionSubmit = useCallback((selectedOption: Option[]) => {
        setCrossSegmentSelectedOptions(prevOptions => {
            const updatedOptions = [...prevOptions, selectedOption.filter(Boolean) as Option[]];
            return updatedOptions;
        });
    }, []);

    useEffect(() => {
        // setTripSelections(prev => ({
        //     ...prev,                    // Spread the previous state
        //     analysisLevelValue: currAnalysisLevel // Update analysisLevelValue with currAnalysisLevel
        // }));

        // setSelections(prev => ({
        //     ...prev,                    // Spread the previous state
        //     analysisLevelValue: currAnalysisLevel // Update analysisLevelValue with currAnalysisLevel
        // }));
    
    
        console.log(currAnalysisLevel?.value);
    }, [currAnalysisLevel]);
    
    return (
        <div className="app-layout">
            <NavBar onMenuOptionChange={handleMenuOptionChange} isTeleworkPage={false} />
            <div className="content-wrapper">
            {(currAnalysisLevel?.value === 'person') ? (
    <div className="content-wrapper">
        {selections.analysisTypeValue?.value === 'betweenyear' ? (
            <TopMenu onOptionChange={handleMenuOptionChange} />
        ) : (
            <CrossSegmentTopMenu
                filterOptionsForTelework={false}
                onSubmit={handleCrossSegmentOptionSubmit}
                crossSegmentSelections={crossSegmentSelectedOptions}
            />
        )}
        <div className="main-area">
            {selections.analysisTypeValue?.value === 'betweenyear' ? (
                <BtwYearMenu onSelectionChange={handleSelectionChange} />
            ) : (
                <CrossSegmentMenu onSelectionChange={handleSelectionChange} />
            )}
            <div className="main-content">
                {selections.analysisTypeValue?.value === 'betweenyear' ? (
                    <BtwYearAnalysis
                        menuSelectedOptions={menuSelectedOptions}
                        toggleState={false}
                        selections={selections}
                        setIsBtwYearLoading={(isLoading: boolean) => true}
                    />
                ) : (
                    <CrossSegmentAnalysis
                        menuSelectedOptions={crossSegmentSelectedOptions}
                        toggleState={false}
                        selections={selections}
                        setIsCrossSegmentLoading={(isLoading: boolean) => true}
                        onProfileRemove={handleProfileRemove}
                    />
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
                <TripLevelAnalysis
                    menuSelectedOptions={menuSelectedOptions}
                    toggleState={false}
                    selections={tripSelections}
                    setIsTripLevelAnalysisLoading={(isLoading: boolean) => true}
                />
            </div>
        </div>
    </div>
)}
            </div>
        </div>
    );
}    