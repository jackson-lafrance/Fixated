import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./core/contexts/AuthContext";
import { UserStatsProvider } from "./core/contexts/UserStatsContext";
import { HabitsView } from "./views/HabitsView";
import { Login } from "./views/Login";
import { Signup } from "./views/Signup";
import { Navigation } from "./components/Navigation";
import { useUserStats } from "./core/contexts/UserStatsContext";
import "./App.css";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="loadingContainer">Loading...</div>;
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

const Home = () => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="homeContainer">
      <div className="homeContent">
        <h1 className="homeTitle">Fixated</h1>
        <p className="homeSubtitle">Lock In. Level Up. Track Your Progress.</p>
        <div className="homeActions">
          <Link to="/login" className="homeButton primary">Sign In</Link>
          <Link to="/signup" className="homeButton">Get Started</Link>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, majorSkillGroups } = useUserStats();
  
  return (
    <div className="dashboardContainer">
      <div className="dashboardHeader">
        <h1>Dashboard</h1>
        <div className="userStats">
          <div className="statCard">
            <div className="statLabel">Level</div>
            <div className="statValue">{user?.level || 1}</div>
          </div>
          <div className="statCard">
            <div className="statLabel">Experience</div>
            <div className="statValue">{user?.experience || 0}</div>
          </div>
          <div className="statCard">
            <div className="statLabel">Overall Rating</div>
            <div className="statValue">{user?.overallRating || 50}</div>
          </div>
        </div>
      </div>
      
      <div className="dashboardContent">
        <div className="section">
          <h2>Skill Categories</h2>
          <div className="skillGroups">
            {majorSkillGroups.map(group => (
              <div key={group.id} className="skillGroupCard">
                <h3>{group.name}</h3>
                <div className="skillGroupRating">Rating: {group.overallRating}</div>
                <div className="skillCount">{group.skills.length} skills</div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/habits" 
          element={
            <ProtectedRoute>
              <Layout><HabitsView /></Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <UserStatsProvider>
        <AppRoutes />
      </UserStatsProvider>
    </AuthProvider>
  );
};

export default App;
