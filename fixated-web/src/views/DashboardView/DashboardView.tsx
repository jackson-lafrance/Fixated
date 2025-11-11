import { useAuth } from "../../core/contexts/AuthContext";
import { useUserStats } from "../../core/contexts/UserStatsContext";
import { UserStats } from "../../components/UserStats";
import { ProgressChart } from "../../components/ProgressChart";
import { QuickStatsCards } from "../../components/QuickStatsCards";
import { DailyGoalsWidget } from "../../components/DailyGoalsWidget";
import { RecentActivityFeed } from "../../components/RecentActivityFeed";
import { StatsComparison } from "../../components/StatsComparison";
import { useNavigate } from "react-router-dom";
import "./DashboardView.css";

export const DashboardView = () => {
  const { logout } = useAuth();
  const { majorSkillGroups } = useUserStats();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="dashboardContainer">
      <header className="dashboardHeader">
        <h1 className="dashboardTitle">Dashboard</h1>
        <button className="logoutButton" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <div className="dashboardContent">
        <QuickStatsCards />
        <div className="dashboardGrid">
          <div className="dashboardLeft">
            <DailyGoalsWidget />
            <RecentActivityFeed />
          </div>
          <div className="dashboardRight">
            <StatsComparison />
            <UserStats />
            <ProgressChart />
          </div>
        </div>
        <div className="skillsSection">
          <h2 className="sectionTitle">Your Skills</h2>
          <div className="skillsGrid">
            {majorSkillGroups.map((group) => (
              <div key={group.id} className="skillGroupSection">
                <h3 className="groupTitle">{group.name}</h3>
                <div className="skillsList">
                  {group.skills.length === 0 ? (
                    <div className="noSkills">No skills added yet</div>
                  ) : (
                    group.skills.map((skill) => (
                      <div key={skill.id} className="skillItem">
                        <span className="skillItemName">{skill.name}</span>
                        <span className="skillItemRating">{skill.rating}/100</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

