import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
        Dashboard
      </Link>
      <Link to="/skills" className={location.pathname === "/skills" ? "active" : ""}>
        Skills
      </Link>
      <Link to="/habits" className={location.pathname === "/habits" ? "active" : ""}>
        Habits
      </Link>
    </nav>
  );
};

