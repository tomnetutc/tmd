import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./CircularProgressBar.css";

interface CircularProgressProps {
  progress: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ progress }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <div className="parent-container" style={{ position: "relative" }}>
      <div className="loading-overlay">
        <div className="progress-wrapper">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textSize: "10px",
              pathColor: `rgba(62, 152, 199, ${progress / 100})`,
              textColor: "#333",
              trailColor: "#eee",
            })}
          />
        </div>{" "}
      </div>
    </div>
  );
};

export default CircularProgress;
