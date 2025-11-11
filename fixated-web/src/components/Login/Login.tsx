import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../core/contexts/AuthContext";
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
        <h1 className="authTitle">Fixated</h1>
        <p className="authSubtitle">Lock In</p>
        <h2 className="authHeading">Sign In</h2>
        
        {error && <div className="errorMessage">{error}</div>}
        
        <form onSubmit={handleSubmit} className="authForm">
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
              placeholder="Enter your password"
              className="formInput"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="authButton"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <p className="authLink">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

