import { useEffect, useState } from "react";
import { useAchievements } from "../../core/contexts/AchievementContext";
import { RARITY_COLORS } from "../../core/constants";
import "./AchievementNotification.css";

export const AchievementNotification = () => {
  const { newlyUnlocked } = useAchievements();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (newlyUnlocked) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [newlyUnlocked]);

  if (!newlyUnlocked || !show) return null;

  const rarityColor = RARITY_COLORS[newlyUnlocked.rarity];

  return (
    <div className={`achievement-notification ${show ? "show" : ""}`}>
      <div className="notification-content" style={{ borderLeftColor: rarityColor }}>
        <div className="notification-icon" style={{ backgroundColor: rarityColor }}>
          {newlyUnlocked.icon}
        </div>
        <div className="notification-text">
          <div className="notification-title">Achievement Unlocked!</div>
          <div className="notification-name">{newlyUnlocked.name}</div>
          <div className="notification-description">{newlyUnlocked.description}</div>
          <div className="notification-reward">+{newlyUnlocked.experienceReward} XP</div>
        </div>
        <button className="notification-close" onClick={() => setShow(false)}>
          ×
        </button>
      </div>
    </div>
  );
};
