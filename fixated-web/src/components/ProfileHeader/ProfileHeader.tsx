import { User } from "../../core/types";
import "./ProfileHeader.css";

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const experienceForNextLevel = user.level * 1000;
  const experienceInCurrentLevel = user.experience % 1000;
  const progressPercentage = (experienceInCurrentLevel / 1000) * 100;

  return (
    <div className="profileHeader">
      <div className="profileHeaderContent">
        <div className="profileAvatar">
          <div className="avatarCircle">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="levelBadge">Lv. {user.level}</div>
        </div>
        <div className="profileInfo">
          <h1 className="profileName">{user.displayName}</h1>
          <div className="profileStats">
            <div className="statItem">
              <span className="statLabel">Overall Rating</span>
              <span className="statValue ratingValue">{user.overallRating}</span>
            </div>
            <div className="statItem">
              <span className="statLabel">Experience</span>
              <span className="statValue">{user.experience.toLocaleString()}</span>
            </div>
          </div>
          <div className="experienceBar">
            <div className="experienceBarFill" style={{ width: `${progressPercentage}%` }} />
            <span className="experienceText">
              {experienceInCurrentLevel} / {experienceForNextLevel} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

