import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./core/contexts/AuthContext";
import { UserStatsProvider, useUserStats } from "./core/contexts/UserStatsContext";
import { HabitsProvider } from "./core/contexts/HabitsContext";
import { ProgressChart } from "./components/ProgressChart";
import { HabitCompletionChart } from "./components/HabitCompletionChart";
import { SkillSpecificChart } from "./components/SkillSpecificChart";
import { StreakChart } from "./components/StreakChart";
import { YesterdayComparisonChart } from "./components/YesterdayComparisonChart";
import { HabitsList } from "./components/HabitsList";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import type { MajorSkillGroup } from "./core/types";
import "./App.css";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      fontSize: "18px",
      color: "#666"
    }}>Loading...</div>;
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const Home = () => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div style={{ 
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      textAlign: "center",
      padding: "24px"
    }}>
      <h1 style={{ fontSize: "48px", marginBottom: "16px", fontWeight: "bold" }}>
        Fixated
      </h1>
      <p style={{ fontSize: "20px", marginBottom: "32px", opacity: 0.9 }}>
        Lock In
      </p>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link 
          to="/login" 
          style={{
            padding: "12px 24px",
            background: "white",
            color: "#667eea",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            transition: "transform 0.2s"
          }}
        >
          Sign In
        </Link>
        <Link 
          to="/signup" 
          style={{
            padding: "12px 24px",
            background: "rgba(255, 255, 255, 0.2)",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            border: "2px solid white",
            transition: "transform 0.2s"
          }}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, majorSkillGroups } = useUserStats();
  const { logout, userData } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
          Dashboard
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {userData && (
            <span style={{ color: "#666", fontSize: "14px" }}>
              {userData.displayName}
            </span>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "#f0f0f0",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              color: "#333",
              transition: "background 0.2s"
            }}
            onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.background = "#e0e0e0"}
            onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.background = "#f0f0f0"}
          >
            Logout
          </button>
        </div>
      </div>
      
      {user && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "24px", 
          marginBottom: "32px" 
        }}>
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666", textTransform: "uppercase" }}>
              Level
            </h3>
            <p style={{ margin: 0, fontSize: "36px", fontWeight: "bold", color: "#667eea" }}>
              {user.level}
            </p>
          </div>
          
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666", textTransform: "uppercase" }}>
              Experience
            </h3>
            <p style={{ margin: 0, fontSize: "36px", fontWeight: "bold", color: "#764ba2" }}>
              {user.experience.toLocaleString()}
            </p>
          </div>
          
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666", textTransform: "uppercase" }}>
              Overall Rating
            </h3>
            <p style={{ margin: 0, fontSize: "36px", fontWeight: "bold", color: "#48bb78" }}>
              {user.overallRating}
            </p>
          </div>
        </div>
      )}
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "24px", marginTop: "32px" }}>
        <ProgressChart />
        <YesterdayComparisonChart />
      </div>
      
      <SkillSpecificChart />
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", gap: "24px", marginTop: "24px" }}>
        <HabitCompletionChart />
        <StreakChart />
      </div>
      
      {majorSkillGroups.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <h2 style={{ marginBottom: "24px", fontSize: "24px", fontWeight: "bold" }}>
            Skill Categories
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px"
          }}>
            {majorSkillGroups.map((group: MajorSkillGroup) => (
              <div
                key={group.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                }}
              >
                <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>
                  {group.name}
                </h3>
                <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#666" }}>
                  {group.skills.length} skill{group.skills.length !== 1 ? "s" : ""}
                </p>
                <div style={{
                  background: "#f0f0f0",
                  borderRadius: "8px",
                  height: "8px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                    height: "100%",
                    width: `${group.overallRating}%`,
                    transition: "width 0.3s ease"
                  }} />
                </div>
                <p style={{ margin: "8px 0 0 0", fontSize: "16px", fontWeight: "bold", color: "#333" }}>
                  {group.overallRating}/100
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <HabitsList />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <UserStatsProvider>
        <HabitsProvider>
          <AppRoutes />
        </HabitsProvider>
      </UserStatsProvider>
    </AuthProvider>
  );
};

export default App;
