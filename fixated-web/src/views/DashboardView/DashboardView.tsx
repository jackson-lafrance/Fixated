import { useAuth } from "../../core/contexts/AuthContext";
import { useUserStats } from "../../core/contexts/UserStatsContext";
import { Navigation } from "../../components/Navigation";
import { useNavigate } from "react-router-dom";
import "./DashboardView.css";

export const DashboardView = () => {
  const { logout, userData } = useAuth();
  const { majorSkillGroups, user } = useUserStats();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="page">
      <Navigation />
      <div className="pageHeader">
        <h1 className="pageTitle">Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      
      {user && (
        <div className="userInfo">
          <p><strong>Level:</strong> {user.level}</p>
          <p><strong>Experience:</strong> {user.experience}</p>
          <p><strong>Overall Rating:</strong> {user.overallRating}/100</p>
        </div>
      )}

      <div className="section">
        <h2>Your Skills</h2>
        {majorSkillGroups.map((group) => (
          <div key={group.id} className="skillGroup">
            <h3>{group.name} - Rating: {group.overallRating}/100</h3>
            {group.skills.length === 0 ? (
              <p>No skills added yet. Go to Skills page to add some!</p>
            ) : (
              <ul>
                {group.skills.map((skill) => (
                  <li key={skill.id}>
                    {skill.name}: {skill.rating}/100
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
