import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./core/contexts/AuthContext";
import { UserStatsProvider } from "./core/contexts/UserStatsContext";
import { SkillsView } from "./views/SkillsView";
import { MySkillsView } from "./views/MySkillsView";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Dashboard } from "./views/Dashboard";
import { Loading } from "./components/Loading";
import "./App.css";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <Loading message="Checking authentication..." />;
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const Home = () => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <h1 style={{ fontSize: "48px", color: "white", marginBottom: "24px" }}>Fixated - Lock In</h1>
      <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.9)", marginBottom: "32px" }}>Track your skills, build habits, level up</p>
      <div style={{ display: "flex", gap: "16px" }}>
        <Link to="/login" style={{ padding: "12px 24px", background: "white", color: "#667eea", textDecoration: "none", borderRadius: "8px", fontWeight: "600" }}>Login</Link>
        <Link to="/signup" style={{ padding: "12px 24px", background: "rgba(255,255,255,0.2)", color: "white", textDecoration: "none", borderRadius: "8px", fontWeight: "600", border: "2px solid white" }}>Sign Up</Link>
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
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/skills" element={<ProtectedRoute><SkillsView /></ProtectedRoute>} />
        <Route path="/my-skills" element={<ProtectedRoute><MySkillsView /></ProtectedRoute>} />
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
