import { ProgressData } from "../../core/types";
import "./ComparisonCard.css";

interface ComparisonCardProps {
  progressHistory: ProgressData[];
}

const ComparisonCard = ({ progressHistory }: ComparisonCardProps) => {
  if (progressHistory.length < 2) {
    return (
      <div className="comparisonCard">
        <h3 className="comparisonTitle">Today vs Yesterday</h3>
        <div className="noComparisonData">Need at least 2 days of data to compare</div>
      </div>
    );
  }

  const today = progressHistory[progressHistory.length - 1];
  const yesterday = progressHistory[progressHistory.length - 2];

  const ratingDiff = today.overallRating - yesterday.overallRating;
  const levelDiff = today.level - yesterday.level;
  const experienceDiff = today.experience - yesterday.experience;

  const getChangeColor = (value: number) => {
    if (value > 0) return "#00ff88";
    if (value < 0) return "#ff6b6b";
    return "#ffffff";
  };

  const formatChange = (value: number) => {
    if (value > 0) return `+${value}`;
    return value.toString();
  };

  return (
    <div className="comparisonCard">
      <h3 className="comparisonTitle">Today vs Yesterday</h3>
      <div className="comparisonContent">
        <div className="comparisonItem">
          <div className="comparisonLabel">Rating</div>
          <div className="comparisonValues">
            <span className="comparisonValue">{yesterday.overallRating}</span>
            <span className="comparisonArrow">→</span>
            <span className="comparisonValue">{today.overallRating}</span>
            <span 
              className="comparisonChange" 
              style={{ color: getChangeColor(ratingDiff) }}
            >
              {formatChange(ratingDiff)}
            </span>
          </div>
        </div>
        <div className="comparisonItem">
          <div className="comparisonLabel">Level</div>
          <div className="comparisonValues">
            <span className="comparisonValue">{yesterday.level}</span>
            <span className="comparisonArrow">→</span>
            <span className="comparisonValue">{today.level}</span>
            {levelDiff !== 0 && (
              <span 
                className="comparisonChange" 
                style={{ color: getChangeColor(levelDiff) }}
              >
                {formatChange(levelDiff)}
              </span>
            )}
          </div>
        </div>
        <div className="comparisonItem">
          <div className="comparisonLabel">Experience</div>
          <div className="comparisonValues">
            <span className="comparisonValue">{yesterday.experience.toLocaleString()}</span>
            <span className="comparisonArrow">→</span>
            <span className="comparisonValue">{today.experience.toLocaleString()}</span>
            <span 
              className="comparisonChange" 
              style={{ color: getChangeColor(experienceDiff) }}
            >
              {formatChange(experienceDiff)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonCard;

