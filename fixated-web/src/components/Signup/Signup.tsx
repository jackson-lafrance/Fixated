import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    setLoading(true);

    try {
      await signup(email, password, displayName);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signupContainer">
      <div className="signupCard">
        <h1 className="signupTitle">Join Fixated</h1>
        <p className="signupSubtitle">Start Your Journey</p>
        <form onSubmit={handleSubmit} className="signupForm">
          {error && <div className="errorMessage">{error}</div>}
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="signupInput"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signupInput"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="signupInput"
          />
          <button type="submit" disabled={loading} className="signupButton">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="signupFooter">
          Already have an account?{" "}
          <a href="/login" className="signupLink">Login</a>
        </p>
      </div>
    </div>
  );
};

