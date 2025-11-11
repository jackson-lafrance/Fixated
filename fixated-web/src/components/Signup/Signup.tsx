import { useState } from "react";
import { useAuth } from "../../core/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
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
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h1 className="authTitle">Get Started</h1>
        <p className="authSubtitle">Create your account to begin tracking your progress</p>
        
        {error && <div className="errorMessage">{error}</div>}
        
        <form onSubmit={handleSubmit} className="authForm">
          <div className="formGroup">
            <label htmlFor="displayName" className="formLabel">Display Name</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="formInput"
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="email" className="formLabel">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="formInput"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="password" className="formLabel">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="formInput"
              placeholder="Enter your password (min. 6 characters)"
              required
            />
          </div>
          
          <button type="submit" className="authButton" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        
        <p className="authFooter">
          Already have an account? <Link to="/login" className="authLink">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

