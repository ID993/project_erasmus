import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    sifra: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userCredentials.email || !userCredentials.sifra) {
      setError("Email and password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCredentials),
      });

      if (!response.ok) {
        // const data = await response.json();
        setError("Invalid email or password");
        return;
      }

      const data = await response.json();
      setSuccess(true);
      localStorage.setItem("token", data.token);

      // Update isLoggedIn state and navigate to dashboard
      setIsLoggedIn(true);
      // alert("Login successful");
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to connect to the server");
      console.error("Login Error:", err);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{ height: "80vh" }}
    >
      <div
        className="bg-light rounded shadow-lg p-5"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="mb-4 fw-bold text-center">Login</h2>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success w-100 text-center" role="alert">
            Login successful!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger w-100 text-center" role="alert">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="w-100"
          style={{ maxWidth: "400px" }}
        >
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={userCredentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="sifra"
                value={userCredentials.sifra}
                onChange={handleChange}
                placeholder="Enter your password"
                className="form-control"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="btn btn-outline-secondary"
              >
                {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
              </button>
            </div>
          </div>
          <div className="mb-3 text-center">
            <Link to="/register" className="text-decoration-none text-primary">
              Don't have an account? Register
            </Link>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
