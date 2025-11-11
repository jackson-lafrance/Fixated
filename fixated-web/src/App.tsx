import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./core/contexts/AuthContext";
import { UserStatsProvider } from "./core/contexts/UserStatsContext";
import { LeaderboardView } from "./views/Leaderboard";
import "./App.css";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const Home = () => {
  return <div>Fixated - Lock In</div>;
};

const Login = () => {
  return <div>Login</div>;
};

const Signup = () => {
  return <div>Signup</div>;
};

const Dashboard = () => {
  return <div>Dashboard</div>;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<LeaderboardView />} />
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
