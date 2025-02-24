import React from 'react';
import './CustomSegmentDayPattern.scss';

interface Props {
  title: string;
  segmentSize: string;
  unit : string;
}

const CustomSegmentDayPattern: React.FC<Props> = ({title,segmentSize , unit}) => {
  return (
<div className="segment-container" style={{width: "100%"}}>
  <div className="segment-item">
    <label htmlFor="segmentSize">{title}</label>
    <input id="segmentSize" type="text" value={`${segmentSize} ${unit}`} readOnly />
  </div>
</div>
  );
};

export default CustomSegmentDayPattern;
