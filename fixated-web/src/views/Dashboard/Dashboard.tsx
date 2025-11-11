import { Link } from "react-router-dom";
import { useAuth } from "../core/contexts/AuthContext";
import { useUserStats } from "../core/contexts/UserStatsContext";
import { SkillCard } from "../components/SkillCard";
import { Loading } from "../components/Loading";
import "./Dashboard.css";

export const Dashboard = () => {
  const { userData, logout } = useAuth();
  const { majorSkillGroups, user, loading } = useUserStats();

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="dashboardContainer">
        <nav className="dashboardNav">
          <h1 className="dashboardLogo">Fixated</h1>
          <div className="navLinks">
            <Link to="/dashboard" className="navLink">Dashboard</Link>
            <Link to="/skills" className="navLink">Skills</Link>
            <button onClick={handleLogout} className="logoutButton">Logout</button>
          </div>
        </nav>
        <div className="dashboardContent">
          <Loading message="Loading your dashboard..." />
        </div>
      </div>
    );
  }

  const totalSkills = majorSkillGroups.reduce((sum, group) => sum + group.skills.length, 0);
  const averageRating = majorSkillGroups.length > 0
    ? Math.round(majorSkillGroups.reduce((sum, group) => sum + group.overallRating, 0) / majorSkillGroups.length)
    : 50;

  return (
    <div className="dashboardContainer">
      <nav className="dashboardNav">
        <h1 className="dashboardLogo">Fixated</h1>
        <div className="navLinks">
          <Link to="/dashboard" className="navLink">Dashboard</Link>
          <Link to="/my-skills" className="navLink">My Skills</Link>
          <Link to="/skills" className="navLink">Skills Library</Link>
          <button onClick={handleLogout} className="logoutButton">Logout</button>
        </div>
      </nav>

      <div className="dashboardContent">
        <div className="welcomeSection">
          <h2 className="welcomeTitle">Welcome back, {userData?.displayName || "User"}!</h2>
          <p className="welcomeSubtitle">Track your progress and level up your skills</p>
        </div>

        <div className="statsGrid">
          <div className="statCard">
            <div className="statIcon">⭐</div>
            <div className="statInfo">
              <div className="statValue">{user?.level || 1}</div>
              <div className="statLabel">Level</div>
            </div>
          </div>

          <div className="statCard">
            <div className="statIcon">📊</div>
            <div className="statInfo">
              <div className="statValue">{user?.overallRating || 50}</div>
              <div className="statLabel">Overall Rating</div>
            </div>
          </div>

          <div className="statCard">
            <div className="statIcon">🎯</div>
            <div className="statInfo">
              <div className="statValue">{totalSkills}</div>
              <div className="statLabel">Total Skills</div>
            </div>
          </div>

          <div className="statCard">
            <div className="statIcon">💪</div>
            <div className="statInfo">
              <div className="statValue">{user?.experience || 0}</div>
              <div className="statLabel">Experience</div>
            </div>
          </div>
        </div>

        <div className="skillsSection">
          <div className="sectionHeader">
            <h3 className="sectionTitle">Your Skills by Category</h3>
            <Link to="/my-skills" className="viewAllLink">Manage Skills →</Link>
          </div>

          {majorSkillGroups.filter(group => group.skills.length > 0).length > 0 ? (
            <div className="skillGroups">
              {majorSkillGroups
                .filter(group => group.skills.length > 0)
                .map((group) => (
                  <div key={group.id} className="skillGroup">
                    <div className="groupHeader">
                      <h4 className="groupName">{group.name}</h4>
                      <span className="groupRating">Rating: {group.overallRating}/100</span>
                    </div>
                    <div className="skillsGrid">
                      {group.skills.slice(0, 3).map((skill) => (
                        <SkillCard key={skill.id} skill={skill} />
                      ))}
                    </div>
                    {group.skills.length > 3 && (
                      <Link to="/skills" className="viewMoreLink">
                        View {group.skills.length - 3} more skills →
                      </Link>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="emptyState">
              <p>You haven't added any skills yet.</p>
              <Link to="/skills" className="ctaButton">Browse Skills Library</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

