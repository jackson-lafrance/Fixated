import { useAuth } from "../../core/contexts/AuthContext";
import { Link } from "react-router-dom";
import "./Home.css";

export const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="homeContainer">
      <div className="homeContent">
        <h1 className="homeTitle">Fixated</h1>
        <p className="homeSubtitle">Lock In. Level Up. Track Your Progress.</p>
        <p className="homeDescription">
          Build habits, track skills, and watch your progress grow. 
          Transform your daily routines into measurable achievements.
        </p>
        
        {currentUser ? (
          <div className="homeActions">
            <Link to="/dashboard" className="homeButton primary">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="homeActions">
            <Link to="/login" className="homeButton primary">
              Sign In
            </Link>
            <Link to="/signup" className="homeButton secondary">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

