import { useAchievements } from "../../core/contexts/AchievementContext";
import { Achievement as AchievementComponent } from "../../components/Achievement";
import { ACHIEVEMENTS } from "../../core/constants";
import { AchievementRarity } from "../../core/types";
import "./Achievements.css";

export const Achievements = () => {
  const { getAchievementProgress, isAchievementUnlocked } = useAchievements();

  const unlockedCount = ACHIEVEMENTS.filter(a => isAchievementUnlocked(a.id)).length;
  const totalCount = ACHIEVEMENTS.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const achievementsByRarity = {
    [AchievementRarity.LEGENDARY]: ACHIEVEMENTS.filter(a => a.rarity === AchievementRarity.LEGENDARY),
    [AchievementRarity.EPIC]: ACHIEVEMENTS.filter(a => a.rarity === AchievementRarity.EPIC),
    [AchievementRarity.RARE]: ACHIEVEMENTS.filter(a => a.rarity === AchievementRarity.RARE),
    [AchievementRarity.UNCOMMON]: ACHIEVEMENTS.filter(a => a.rarity === AchievementRarity.UNCOMMON),
    [AchievementRarity.COMMON]: ACHIEVEMENTS.filter(a => a.rarity === AchievementRarity.COMMON)
  };

  return (
    <div className="achievements-page">
      <div className="achievements-header">
        <h1 className="achievements-title">Achievements</h1>
        <div className="achievements-stats">
          <div className="stat-item">
            <span className="stat-value">{unlockedCount}</span>
            <span className="stat-label">Unlocked</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{totalCount}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{completionPercentage}%</span>
            <span className="stat-label">Complete</span>
          </div>
        </div>
      </div>

      <div className="achievements-content">
        {Object.entries(achievementsByRarity).map(([rarity, achievements]) => (
          achievements.length > 0 && (
            <div key={rarity} className="achievements-section">
              <h2 className="section-title">{rarity.charAt(0) + rarity.slice(1).toLowerCase()} Achievements</h2>
              <div className="achievements-grid">
                {achievements.map(achievement => (
                  <AchievementComponent
                    key={achievement.id}
                    achievement={achievement}
                    progress={getAchievementProgress(achievement.id)}
                    unlocked={isAchievementUnlocked(achievement.id)}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};
