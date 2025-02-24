import React from 'react';
import { OptionProps } from 'react-select';
import { Tooltip } from 'react-tooltip';
import { DayPatternOption } from '../../Types';

const CustomOption: React.FC<OptionProps<DayPatternOption, true>> = (props) => {
  const { data, innerRef, innerProps, isFocused, isSelected } = props;

  // Unique tooltip ID for each dropdown item
  const tooltipId = `tooltip-${data.value}`;

  return (
    <>
      <div
        ref={innerRef}
        {...innerProps}
        data-tooltip-id={tooltipId}
        data-tooltip-content={`${data.value}`}
        style={{
          padding: '8px',
          cursor: 'pointer',
          position: 'relative',
          backgroundColor: isSelected
            ? "#2684FF"  // React Select default blue when selected
            : isFocused
            ? "#E0EFFF" // Light blue when focused
            : "white",  // Default background
          color: isSelected ? "white" : "black", // White text for selected
          fontWeight: isSelected ? "bold" : "normal",
        }}
      >
        {data.label}
      </div>

      <Tooltip
        id={tooltipId}
        place="right"
        positionStrategy="fixed"
        style={{ zIndex: 9999 }}
      />
    </>
  );
};

export default CustomOption;
