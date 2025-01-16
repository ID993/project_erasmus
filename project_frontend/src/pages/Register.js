import React, { useState, useEffect } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [userCredentials, setUserCredentials] = useState({
    ime: "",
    prezime: "",
    email: "",
    sifra: "",
    ustanova: "",
    uloga: "",
  });
  const [institutions, setInstitutions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch institutions and roles
    const fetchData = async () => {
      try {
        const institutionsRes = await fetch(
          "http://localhost:5000/api/auth/institutions"
        );
        const rolesRes = await fetch("http://localhost:5000/api/auth/roles");

        const institutionsData = await institutionsRes.json();
        const rolesData = await rolesRes.json();

        // Filter out "Admin" role
        const filteredRoles = rolesData.filter(
          (role) => role.naziv !== "admin"
        );

        setInstitutions(institutionsData);
        setRoles(filteredRoles);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCredentials),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess(true);
        navigate("/login");
        // alert("User registered successfully");
      } else {
        setError(data.message || "Failed to register");
      }
    } catch (err) {
      setError("Failed to connect to the server");
      console.error("Registration Error:", err);
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container d-flex flex-column align-items-center py-5 bg-light rounded shadow">
      <h2 className="mb-4 fw-bold text-center">Register</h2>

      {/* Success Message */}
      {success && (
        <div className="alert alert-success w-100 text-center" role="alert">
          Registration successful! Please login.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger w-100 text-center" role="alert">
          {error}
        </div>
      )}

      {/* Registration Form */}
      <form
        onSubmit={handleRegister}
        className="w-100"
        style={{ maxWidth: "400px" }}
      >
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            name="ime"
            value={userCredentials.ime}
            onChange={handleChange}
            placeholder="Enter your first name"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            name="prezime"
            value={userCredentials.prezime}
            onChange={handleChange}
            placeholder="Enter your last name"
            className="form-control"
            required
          />
        </div>

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

        <div className="mb-3">
          <label htmlFor="institution" className="form-label">
            Institution
          </label>
          <select
            name="ustanova"
            value={userCredentials.ustanova}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select Institution</option>
            {institutions.map((inst) => (
              <option key={inst._id} value={inst._id}>
                {inst.ime}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <select
            name="uloga"
            value={userCredentials.uloga}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.naziv}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3 text-center">
          <Link to="/login" className="text-decoration-none text-primary">
            Already have an account? Login
          </Link>
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary btn-lg">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
