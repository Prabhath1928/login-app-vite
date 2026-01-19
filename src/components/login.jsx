import React, { useState, useEffect } from "react";
import "./Login.css";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ If already logged in, redirect to Home
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://fakestoreapi.com/auth/login",
        {
          username: username.trim(),
          password: password.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        setSuccess("Login successful! Redirecting...");

        // ✅ Replace login page in history
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 1000);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="desktop-login">
      {/* Left Branding Section */}
      <div className="login-left">
        <h1>Welcome Back 👋</h1>
        <p>Login to continue to your dashboard and manage your account easily.</p>
      </div>

      {/* Right Login Section */}
      <div className="login-right">
        <div className="login-form">
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Social Login */}
          <div className="social-login">
            <p>Or login with</p>
            <div className="social-icons">
              <button type="button"><FaGoogle /></button>
              <button type="button"><FaFacebookF /></button>
              <button type="button"><FaTwitter /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
