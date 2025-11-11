import { useUserStats } from "../../core/contexts/UserStatsContext";
import { Link } from "react-router-dom";
import ProfileHeader from "../../components/ProfileHeader";
import StatsOverview from "../../components/StatsOverview";
import ComparisonCard from "../../components/ComparisonCard";
import SkillGroupCard from "../../components/SkillGroupCard";
import ProgressChart from "../../components/ProgressChart";
import "./Profile.css";

const Profile = () => {
  const { user, majorSkillGroups, progressHistory } = useUserStats();

  if (!user) {
    return <div className="profileLoading">Loading profile...</div>;
  }

  const totalSkills = majorSkillGroups.reduce((sum, group) => sum + group.skills.length, 0);

  return (
    <div className="profileContainer">
      <nav className="profileNav">
        <Link to="/dashboard" className="navLink">Dashboard</Link>
        <Link to="/profile" className="navLink active">Profile</Link>
      </nav>
      <ProfileHeader user={user} />
      <div className="profileContent">
        <StatsOverview progressHistory={progressHistory} totalSkills={totalSkills} />
        <ComparisonCard progressHistory={progressHistory} />
        <div className="skillGroupsSection">
          <h2 className="sectionTitle">Skill Groups</h2>
          <div className="skillGroupsGrid">
            {majorSkillGroups.map((group) => (
              <SkillGroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
        <div className="progressSection">
          <h2 className="sectionTitle">Progress History</h2>
          <ProgressChart progressData={progressHistory} />
        </div>
      </div>
    </div>
  );
};

export default Profile;

