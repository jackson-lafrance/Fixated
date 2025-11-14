import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./core/contexts/AuthContext";
import { UserStatsProvider } from "./core/contexts/UserStatsContext";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { DashboardView } from "./views/DashboardView";
import { SkillsView } from "./views/SkillsView";
import { HabitsView } from "./views/HabitsView";
import "./App.css";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div style={{ padding: '20px', fontSize: '24px', color: 'white' }}>Loading...</div>;
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const Home = () => {
  return (
    <div style={{ 
      padding: '2rem',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Fixated</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Lock In</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <a href="/login" style={{ padding: '0.75rem 1.5rem', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Login
        </a>
        <a href="/signup" style={{ padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Sign Up
        </a>
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
        <Route path="/dashboard" element={<ProtectedRoute><DashboardView /></ProtectedRoute>} />
        <Route path="/skills" element={<ProtectedRoute><SkillsView /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><HabitsView /></ProtectedRoute>} />
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
