import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./core/contexts/AuthContext";
import { UserStatsProvider } from "./core/contexts/UserStatsContext";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { DashboardView } from "./views/DashboardView";
import { Home } from "./views/Home";
import { Loading } from "./components/Loading";
import "./App.css";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={currentUser ? <Navigate to="/dashboard" replace /> : <Home />} 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute children={<DashboardView />} />} />
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
