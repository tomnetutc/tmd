import React from 'react';
import './css/CustomSegment.scss';

interface Props {
  title: string;
  segmentSize: string;
  unit : string;
}

const CustomSegment: React.FC<Props> = ({title,segmentSize , unit}) => {
  return (
    <div  className="container">
<div className="segment-container">
  <div className="segment-item">
    <label htmlFor="segmentSize">{title} <b>{segmentSize}</b> {unit}</label>
      </div>
</div>
</div>
  );
};

export default CustomSegment;
