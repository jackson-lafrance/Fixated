import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../core/contexts/AuthContext";
import "./Navigation.css";

export const Navigation = () => {
  const { currentUser, logout, userData } = useAuth();
  const location = useLocation();

  if (!currentUser) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="navBrand">
        <Link to="/dashboard">Fixated</Link>
      </div>
      <div className="navLinks">
        <Link 
          to="/dashboard" 
          className={isActive("/dashboard") ? "active" : ""}
        >
          Dashboard
        </Link>
        <Link 
          to="/habits" 
          className={isActive("/habits") ? "active" : ""}
        >
          Habits
        </Link>
      </div>
      <div className="navUser">
        <span className="userName">{userData?.displayName || "User"}</span>
        <span className="userLevel">Lv. {userData?.level || 1}</span>
        <button onClick={logout} className="logoutButton">
          Logout
        </button>
      </div>
    </nav>
  );
};

