import React, { useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
import { Option } from '../Types';
import { groupedOptions } from '../utils/Helpers';
import '../css/topmenu.scss';
import Select from 'react-select';
import { cross } from 'd3';
import { useFetcher } from 'react-router-dom';
import Infobox from './InfoBox/InfoBox';

const CrossSegmentTopMenu: React.FC<{ 
    filterOptionsForTelework?: boolean; 
    onSubmit: (selectedOption: Option[]) => void; 
    crossSegmentSelections?: Option[][] 
}> = ({ 
    filterOptionsForTelework = false, 
    onSubmit, 
    crossSegmentSelections = [[]]
}) => {
    const [selectedOptions, setSelectedOptions] = useState<Array<Option | null>>([null, null, null]);

    const handleChange = (index: number, option: Option | null) => {
        const updatedSelectedOptions = [...selectedOptions];
        updatedSelectedOptions[index] = option;
        setSelectedOptions(updatedSelectedOptions);
    };

    const handleSubmit = () => {
        // Only allow submission if options are selected and the limit of 5 segments isn't exceeded
        if (selectedOptions.some(option => option !== null) && (crossSegmentSelections.length < 5 || crossSegmentSelections.length==undefined)) {
            // setSubmissions(prevOptions =>{
            //     console.log(prevOptions);
            //     const updatedOptions=[...prevOptions, selectedOptions.filter(Boolean) as Option[]];
            //     console.log(updatedOptions);
            //     return updatedOptions;
            // })
            onSubmit(selectedOptions.filter(Boolean) as Option[]);
            setSelectedOptions([null, null, null]);
        } else {
            alert("Please select an option or reach the segment limit.");
        }
    };

    const handleReset = () => {
        setSelectedOptions([null, null, null]);
    };


    // Filter options if telework-specific
    const filteredGroupedOptions = filterOptionsForTelework
        ? groupedOptions.filter(group => group.label !== "Work arrangement" && group.label !== "Employment")
        : groupedOptions;

    const isOptionSelectedInOtherDropdown = (option: Option, currentIndex: number) => {
        return selectedOptions.some((selectedOption, index) => selectedOption && selectedOption.value === option.value && index !== currentIndex);
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
        <div className="dropdown-wrapper">
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
                        isDisabled: isOptionSelectedInOtherDropdown(option, index),
                    })),
                }))}
                isSearchable={true}
                styles={customStyles}
                components={{ DropdownIndicator: CustomDropdownIndicator }}
                menuPortalTarget={document.body}
                menuPosition={'fixed'}
                maxMenuHeight={200}
                placeholder="Select attribute"
            />
        </div>
    );

    return (
        <div className="menu-container">
            <div className="menu-header" style={{ position: 'relative' }}>
                <div className="options-container">
                    <label className="segment-label">Add Segment:</label>
                    <div className="dropdowns-menu-container">
                        {selectedOptions.map((_, index) => (
                            <div key={index} className="dropdown-wrapper">
                                {renderDropdown(index)}
                            </div>
                        ))}
                    </div>
                    <div className="button-container">
                        <Button
                            size="sm"
                            variant='success'
                            onClick={handleSubmit}
                            className="submit-button"
                            disabled={crossSegmentSelections.length === 5 || !selectedOptions.some(option => option !== null)}
                        >
                            Add
                        </Button>
                    </div>

                    <div className="button-container">
                        <Button size="sm" onClick={handleReset} className="reset-button" variant="danger" disabled={!selectedOptions.some(option => option !== null)}>
                            Reset
                        </Button>
                    </div>
                    <Infobox style={{ display: 'flex', position: 'relative', padding: 12, right : 20 }}>
                        <p>Select up to three attributes to define and add a specific population segment for comparison purposes. The default view shows data for ‘all’ individuals aged 15 and older.</p>
                    </Infobox>
                </div>
            </div>
        </div>
    );
};

export default CrossSegmentTopMenu;

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
