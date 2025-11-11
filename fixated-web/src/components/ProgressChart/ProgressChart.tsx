import React from "react";
import { ProgressData } from "../../core/types";
import "./ProgressChart.css";

interface ProgressChartProps {
  progressData: ProgressData[];
}

const ProgressChart = ({ progressData }: ProgressChartProps) => {
  if (progressData.length === 0) {
    return <div className="noProgressData">No progress data available yet</div>;
  }

  const recentData = progressData.slice(-30);
  
  const maxRating = Math.max(...recentData.map(d => d.overallRating), 100);
  const minRating = Math.min(...recentData.map(d => d.overallRating), 0);
  const ratingRange = maxRating - minRating || 1;

  const maxLevel = Math.max(...recentData.map(d => d.level), 1);
  const minLevel = Math.min(...recentData.map(d => d.level), 1);
  const levelRange = maxLevel - minLevel || 1;

  const maxExperience = Math.max(...recentData.map(d => d.experience), 1000);
  const minExperience = Math.min(...recentData.map(d => d.experience), 0);
  const experienceRange = maxExperience - minExperience || 1;

  const getRelativeHeight = (value: number, min: number, range: number) => {
    return ((value - min) / range) * 100;
  };

  const [selectedMetric, setSelectedMetric] = React.useState<"rating" | "level" | "experience">("rating");

  return (
    <div className="progressChart">
      <div className="chartControls">
        <button 
          className={`metricButton ${selectedMetric === "rating" ? "active" : ""}`}
          onClick={() => setSelectedMetric("rating")}
        >
          Rating
        </button>
        <button 
          className={`metricButton ${selectedMetric === "level" ? "active" : ""}`}
          onClick={() => setSelectedMetric("level")}
        >
          Level
        </button>
        <button 
          className={`metricButton ${selectedMetric === "experience" ? "active" : ""}`}
          onClick={() => setSelectedMetric("experience")}
        >
          Experience
        </button>
      </div>
      <div className="chartContainer">
        <div className="chartBars">
          {recentData.map((data, index) => {
            let height = 0;
            let value = 0;
            let color = "";

            if (selectedMetric === "rating") {
              height = getRelativeHeight(data.overallRating, minRating, ratingRange);
              value = data.overallRating;
              color = "#00ff88";
            } else if (selectedMetric === "level") {
              height = getRelativeHeight(data.level, minLevel, levelRange);
              value = data.level;
              color = "#00ccff";
            } else {
              height = getRelativeHeight(data.experience, minExperience, experienceRange);
              value = data.experience;
              color = "#ff6b6b";
            }

            return (
              <div key={index} className="chartBar">
                <div 
                  className="barFill" 
                  style={{ 
                    height: `${height}%`,
                    backgroundColor: color
                  }}
                  title={`${data.date.toLocaleDateString()}: ${value}`}
                />
              </div>
            );
          })}
        </div>
        <div className="chartLabels">
          <span>{recentData[0]?.date.toLocaleDateString()}</span>
          <span>{recentData[recentData.length - 1]?.date.toLocaleDateString()}</span>
        </div>
      </div>
      <div className="chartStats">
        <div className="chartStat">
          <span className="chartStatLabel">Current {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}</span>
          <span className="chartStatValue">
            {selectedMetric === "experience" 
              ? recentData[recentData.length - 1]?.experience.toLocaleString() || 0
              : recentData[recentData.length - 1]?.[selectedMetric === "rating" ? "overallRating" : "level"] || 0}
          </span>
        </div>
        <div className="chartStat">
          <span className="chartStatLabel">30 Day Change</span>
          <span className="chartStatValue">
            {recentData.length > 1 
              ? (() => {
                  const current = recentData[recentData.length - 1];
                  const previous = recentData[0];
                  const diff = selectedMetric === "rating" 
                    ? current.overallRating - previous.overallRating
                    : selectedMetric === "level"
                    ? current.level - previous.level
                    : current.experience - previous.experience;
                  return diff > 0 ? `+${diff.toLocaleString()}` : diff.toLocaleString();
                })()
              : "0"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;

