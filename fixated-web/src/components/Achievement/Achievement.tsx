import { Achievement as AchievementType, AchievementRarity } from "../../core/types";
import { RARITY_COLORS } from "../../core/constants";
import "./Achievement.css";

interface AchievementProps {
  achievement: AchievementType;
  progress: number;
  unlocked: boolean;
}

export const Achievement = ({ achievement, progress, unlocked }: AchievementProps) => {
  const progressPercentage = Math.min((progress / achievement.requirement) * 100, 100);
  const rarityColor = RARITY_COLORS[achievement.rarity];

  return (
    <div className={`achievement ${unlocked ? "unlocked" : "locked"}`}>
      <div className="achievement-icon" style={{ borderColor: rarityColor }}>
        <span className="icon">{achievement.icon}</span>
        {unlocked && <span className="checkmark">✓</span>}
      </div>
      <div className="achievement-content">
        <h3 className="achievement-name">{achievement.name}</h3>
        <p className="achievement-description">{achievement.description}</p>
        <div className="achievement-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: rarityColor
              }}
            />
          </div>
          <span className="progress-text">
            {progress} / {achievement.requirement}
          </span>
        </div>
        <div className="achievement-reward">
          <span className="reward-label">Reward:</span>
          <span className="reward-value">+{achievement.experienceReward} XP</span>
        </div>
        <div className="achievement-rarity" style={{ color: rarityColor }}>
          {achievement.rarity.toUpperCase()}
        </div>
      </div>
    </div>
  );
};
