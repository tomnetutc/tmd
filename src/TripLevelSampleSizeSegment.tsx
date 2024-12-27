import React from 'react';
import './css/TripLevelSampleSizeSegment.scss';

interface Props {
  segmentSize: string;
}

const TripLevelSampleSizeSegment: React.FC<Props> = ({ segmentSize }) => {
  return (
    <div  className="container">
<div className="segment-container">
  <div className="segment-item">
    <label htmlFor="segmentSize">Segment Size:</label>
    <input id="segmentSize" type="text" value={`${segmentSize} people`} readOnly />
  </div>
</div>
</div>
  );
};

export default TripLevelSampleSizeSegment;
