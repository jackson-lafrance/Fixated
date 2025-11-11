import { useAuth } from "../../core/contexts/AuthContext";
import { useUserStats } from "../../core/contexts/UserStatsContext";
import "./UserStats.css";

export const UserStats = () => {
  const { userData } = useAuth();
  const { user, majorSkillGroups } = useUserStats();

  if (!user && !userData) {
    return null;
  }

  const displayUser = user || userData;

  return (
    <div className="userStatsContainer">
      <div className="userStatsHeader">
        <div className="userLevelBadge">
          <span className="levelLabel">Level</span>
          <span className="levelNumber">{displayUser?.level || 1}</span>
        </div>
        <div className="userInfo">
          <h2 className="userName">{displayUser?.displayName || "User"}</h2>
          <div className="userRating">
            <span className="ratingLabel">Overall Rating</span>
            <span className="ratingValue">{displayUser?.overallRating || 50}/100</span>
          </div>
        </div>
      </div>
      <div className="experienceBar">
        <div className="experienceLabel">
          Experience: {displayUser?.experience || 0} / {((displayUser?.level || 1) * 1000)}
        </div>
        <div className="experienceBarContainer">
          <div 
            className="experienceBarFill"
            style={{ width: `${((displayUser?.experience || 0) % 1000) / 10}%` }}
          />
        </div>
      </div>
      <div className="skillGroupsGrid">
        {majorSkillGroups.map((group) => (
          <div key={group.id} className="skillGroupCard">
            <h3 className="skillGroupName">{group.name}</h3>
            <div className="skillGroupRating">{group.overallRating}/100</div>
            <div className="skillCount">{group.skills.length} skills</div>
          </div>
        ))}
      </div>
    </div>
  );
};

