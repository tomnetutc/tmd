import './InfoBox.scss';
import React, { ReactNode } from 'react';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

interface InfoBoxProps {
  children: ReactNode;
  style?: React.CSSProperties;
}

const InfoBox: React.FC<InfoBoxProps> = ({ children, style }) => {
  return (
    <>
      <div className="info-box-position" style={style}>
        <Tooltip title={children}>
          <InfoIcon className="info-icon" />
        </Tooltip>
      </div>
    </>
  );
};

export default InfoBox;