import React, { useEffect, useState } from 'react';
import Button from "react-bootstrap/Button";
import { Option } from './Types';
import { groupedOptions } from './utils/Helpers';
import './css/topmenu.scss';
import Select from 'react-select';
import Infobox from './components/InfoBox/InfoBox';

const TopMenu: React.FC<{ onOptionChange: (options: Option[]) => void; filterOptionsForTelework?: boolean }> = ({ onOptionChange, filterOptionsForTelework = false }) => {
    const [selectedOptions, setSelectedOptions] = useState<Array<Option | null>>([null, null, null]);
    const [appliedOptions, setAppliedOptions] = useState<Array<Option | null>>([null, null, null]); // Added state for applied options
    const [isAllSelected, setIsAllSelected] = useState(true);
    const [isAnySelected, setIsAnySelected] = useState(false);


    const handleChange = (index: number, option: Option | null) => {
        setSelectedOptions((prevSelectedOptions) => {
            const updatedSelectedOptions = [...prevSelectedOptions];
            updatedSelectedOptions[index] = option;
    
            // Determine if any option is selected
            const hasSelectedOptions = updatedSelectedOptions.some(opt => opt !== null);
    
            setIsAnySelected(hasSelectedOptions);
            if (hasSelectedOptions) {
                setAppliedOptions(updatedSelectedOptions); // Update applied options
                onOptionChange(isAllSelected ? [] : updatedSelectedOptions.filter(Boolean) as Option[]);
            } else {
                alert("Please select an option or check 'All'");
            }
    
            return updatedSelectedOptions; // Ensure state updates correctly
        });
    };
    

    // Filter out the "Work arrangement" and "Employment" options for the Telework Menu component
    const filteredGroupedOptions = filterOptionsForTelework ?
        groupedOptions.filter(group => group.label !== "Work arrangement" && group.label !== "Employment") :
        groupedOptions;

    const handleAllSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsAllSelected(event.target.checked);
        if (event.target.checked) {
            setSelectedOptions([null, null, null]);
            handleReset();
        }
    };

    const handleReset = () => {
        setSelectedOptions([null, null, null]);
        setAppliedOptions([null, null, null]); // Reset applied options as well
        setIsAllSelected(true);
        onOptionChange([] as Option[]);
        setIsAnySelected(false);
    };

    const isOptionSelectedInOtherDropdown = (option: Option, currentIndex: number) => {
        return selectedOptions.some((selectedOption, index) => {
            return selectedOption && selectedOption.value === option.value && index !== currentIndex;
        });
    };

    const scrollToSelectedOption = () => {
        setTimeout(() => {
            const selectedEl = document.querySelector(".dropdown-select__option--is-selected");
            if (selectedEl) {
                selectedEl.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
            }
        }, 15);
    };

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            border: '1px solid #ced4da',
            borderRadius: '0.29rem',
            minHeight: '36px',
            fontSize: '13.5px',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#6c757d'
        }),
        option: (provided: any) => ({
            ...provided,
            fontSize: '13.5px'
        })
    };



    const renderDropdown = (index: number) => (
        <div className="dropdown-wrapper" onClick={() => isAllSelected && setIsAllSelected(false)}>
            <Select
                className="dropdown-select"
                classNamePrefix="dropdown-select"
                onMenuOpen={scrollToSelectedOption}
                value={selectedOptions[index]}
                onChange={(selectedOption) => handleChange(index, selectedOption)}
                options={filteredGroupedOptions.map(group => ({
                    label: group.label,
                    options: group.options.map(option => ({
                        ...option,
                        isDisabled: isAllSelected || isOptionSelectedInOtherDropdown(option, index),
                    })),
                }))}
                isSearchable={true}
                styles={customStyles}
                components={{
                    DropdownIndicator: CustomDropdownIndicator,
                }}
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
                maxMenuHeight={200}
                isDisabled={isAllSelected}
                placeholder="Select attribute"
            />
        </div>
    );

    return (
        <div className="menu-container">
            <div className="menu-header" style={{ position: 'relative' }}>
            <div className="options-container">
                <label className="segment-label">Select Segment:</label>
                <div className="all-select-checkbox">
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleAllSelectChange}
                        disabled={isAnySelected}
                    />
                    <span className="all-select-label">All</span>
                </div>
                <div className="dropdowns-menu-container">
                    {selectedOptions.map((_, index) => (
                        <div key={index} className="dropdown-wrapper">
                            {renderDropdown(index)}
                        </div>
                    ))}
                </div>
                <div className="button-container">
                    <Button size="sm" onClick={handleReset} className="reset-button" variant="danger" style={{ marginLeft: '10px' }}>
                        Reset
                    </Button>
                </div>
                <Infobox style={{ display: 'flex', position: 'relative', padding: 12, right : 23 }}>
                    <p>Select up to three attributes to define a specific population segment and limit the analysis to that group. The default view shows data for ‘all’ individuals aged 15 and older.</p>
                </Infobox>
            </div>
            </div>
        </div>
    );

};

export default TopMenu;

const CustomDropdownIndicator: React.FC<{}> = () => (
    <div className="dropdown-indicator">
        <svg width="15" height="15" fill="currentColor" className="bi bi-chevron-down" viewBox="-2 -2 21 21">
            <path
                fillRule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
            />
        </svg>
    </div>
);
