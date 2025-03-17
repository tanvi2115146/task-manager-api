import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/AuthService";
import { jwtDecode } from "jwt-decode"; 
import "./Login.css";  

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      const token = response.data.token;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Decode token to check role
      const decoded = jwtDecode(token);

      alert("Login successful");

      // Redirect to dashboard after successful login
      navigate("/dashboard");

    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="login-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <button 
          onClick={() => navigate("/forgot-password")} 
          className="login-forgot-password"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
}

export default Login;
