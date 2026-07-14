import './FilterChipDetails.scss';
import React, { ReactNode } from 'react';
import Tooltip from '@mui/material/Tooltip';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { Option } from '../../Types';

interface FilterChipDetailsProps {
  children: ReactNode;
  label: string;
  options: Option[];
  selected?: Set<string>;
}

const FilterChipDetails: React.FC<FilterChipDetailsProps> = ({ children, label, options, selected }) => {
  const title = (
    <div className="filter-chip-details">
      <div className="filter-chip-details__title">{label}</div>
      <ul className="filter-chip-details__list">
        {options.map(opt => {
          const isSelected = !selected || selected.has(opt.value);
          return (
            <li key={opt.value} className="filter-chip-details__item">
              {isSelected ? (
                <CheckBoxIcon
                  className="filter-chip-details__icon filter-chip-details__icon--checked"
                  fontSize="small"
                />
              ) : (
                <DisabledByDefaultIcon
                  className="filter-chip-details__icon filter-chip-details__icon--unchecked"
                  fontSize="small"
                />
              )}
              <span className="filter-chip-details__label">{opt.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <Tooltip
      title={title}
      placement="bottom"
      arrow
      componentsProps={{
        tooltip: { className: 'filter-chip-details__tooltip' },
        arrow: { className: 'filter-chip-details__arrow' },
      }}
    >
      <span className="filter-chip-details__trigger">{children}</span>
    </Tooltip>
  );
};

export default FilterChipDetails;
