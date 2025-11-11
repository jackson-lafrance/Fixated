import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../core/contexts/AuthContext";
import "./Signup.css";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!displayName.trim()) {
      setError("Display name is required");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, displayName.trim());
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h1 className="authTitle">Fixated</h1>
        <p className="authSubtitle">Lock In</p>
        <h2 className="authHeading">Create Account</h2>
        
        {error && <div className="errorMessage">{error}</div>}
        
        <form onSubmit={handleSubmit} className="authForm">
          <div className="formGroup">
            <label htmlFor="displayName">Display Name</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="Enter your name"
              className="formInput"
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="formInput"
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password (min 6 characters)"
              className="formInput"
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
              className="formInput"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="authButton"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        
        <p className="authLink">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

