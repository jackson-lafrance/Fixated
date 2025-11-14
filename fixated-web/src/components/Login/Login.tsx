import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="loginContainer">
      <div className="loginCard">
        <h1 className="loginTitle">Fixated</h1>
        <p className="loginSubtitle">Lock In</p>
        <form onSubmit={handleSubmit} className="loginForm">
          {error && <div className="errorMessage">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="loginInput"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="loginInput"
          />
          <button type="submit" disabled={loading} className="loginButton">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="loginFooter">
          Don't have an account?{" "}
          <a href="/signup" className="loginLink">Sign up</a>
        </p>
      </div>
    </div>
  );
};

