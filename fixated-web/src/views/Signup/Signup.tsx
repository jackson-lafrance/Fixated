import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../core/contexts/AuthContext";
import "./Signup.css";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, displayName);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h1 className="authTitle">Get Started</h1>
        <p className="authSubtitle">Create your account to begin tracking</p>
        
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
              placeholder="At least 6 characters"
              minLength={6}
            />
          </div>
          
          <button type="submit" disabled={loading} className="authButton">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        
        <p className="authFooter">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

