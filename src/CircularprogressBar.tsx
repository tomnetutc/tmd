import React, { useEffect, useState, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./CircularProgressBar.css";

interface CircularProgressProps {
  progress: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ progress }) => {
  const [visible, setVisible] = useState(true);
  const prevProgressRef = useRef<number>(progress); // Track previous progress value

  // Cap progress at 100
  const cappedProgress = Math.min(progress, 100);

  useEffect(() => {
    // Update prevProgressRef after each render
    const prevProgress = prevProgressRef.current;

    if (cappedProgress === 100) {
      // Hide after 500ms when progress reaches 100
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    } else if (prevProgress === 100 && cappedProgress < 100) {
      // Reset visibility when progress drops from 100 to a lower value
      setVisible(false); // Briefly hide to reset
      setTimeout(() => setVisible(true), 0); // Immediately show again with new progress
    } else {
      // Ensure visible for any other progress value
      setVisible(true);
    }

    // Update the ref with the current capped progress value
    prevProgressRef.current = cappedProgress;
  }, [cappedProgress]);

  if (!visible) return null;

  return (
    <div className="parent-container" style={{ position: "relative" }}>
      <div className="loading-overlay">
        <div className="progress-wrapper">
          <CircularProgressbar
            value={cappedProgress}
            text={`${cappedProgress}%`}
            styles={buildStyles({
              textSize: "10px",
              pathColor: `rgba(62, 152, 199, ${cappedProgress / 100})`,
              textColor: "#333",
              trailColor: "#eee",
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
