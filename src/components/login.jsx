import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
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
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
        setSuccess("Login successful! Redirecting...");

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
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
    <div className="min-h-screen flex items-center justify-center px-6
                    bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">

      <div className="max-w-6xl w-full rounded-3xl shadow-2xl overflow-hidden 
                      grid grid-cols-1 md:grid-cols-2 bg-white/10 backdrop-blur-xl">

        <div className="hidden md:flex flex-col justify-center px-14 
                        bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 
                        text-white">

          <h1 className="text-4xl font-bold mb-4">Welcome Back 👋</h1>

          <p className="text-lg opacity-90">
            Login to continue to your dashboard and manage your account easily.
          </p>
        </div>

        <div className="flex items-center justify-center bg-white/90">

          <div className="p-10 rounded-2xl shadow-xl w-full max-w-md">

            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block mb-1 font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full border border-gray-300 p-2 rounded 
                             focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border border-gray-300 p-2 rounded 
                             focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded 
                           hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="mb-3 text-gray-500">Or login with</p>

              <div className="flex justify-center space-x-4">
                <button className="p-3 border rounded-full hover:bg-gray-200">
                  <FaGoogle />
                </button>
                <button className="p-3 border rounded-full hover:bg-gray-200">
                  <FaFacebookF />
                </button>
                <button className="p-3 border rounded-full hover:bg-gray-200">
                  <FaTwitter />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
