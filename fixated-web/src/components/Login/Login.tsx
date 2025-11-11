import { useState } from "react";
import { useAuth } from "../../core/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h1 className="authTitle">Welcome Back</h1>
        <p className="authSubtitle">Sign in to continue your journey</p>
        
        {error && <div className="errorMessage">{error}</div>}
        
        <form onSubmit={handleSubmit} className="authForm">
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
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="authButton" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <p className="authFooter">
          Don't have an account? <Link to="/signup" className="authLink">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

