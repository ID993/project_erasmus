import React, { useState, useEffect } from "react";

const AddAdminUser = () => {
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    sifra: "",
    ustanova: "",
  });
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch institutions and roles
    const fetchData = async () => {
      try {
        const institutionsRes = await fetch(
          "http://localhost:5000/api/auth/institutions"
        );

        const institutionsData = await institutionsRes.json();

        setInstitutions(institutionsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/add-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        setError(data.message || "An error occurred.");
      } else {
        setLoading(false);
        setSuccessMessage("Admin user added successfully.");
        setFormData({
          ime: "",
          prezime: "",
          email: "",
          sifra: "",
        });
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || "An error occurred.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold">Add Admin User</h2>

      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="mb-3">
          <label htmlFor="ime" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="ime"
            name="ime"
            className="form-control"
            value={formData.ime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="prezime" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="prezime"
            name="prezime"
            className="form-control"
            value={formData.prezime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="sifra" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="sifra"
            name="sifra"
            className="form-control"
            value={formData.sifra}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="institution" className="form-label">
            Institution
          </label>
          <select
            name="ustanova"
            value={formData.ustanova}
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

        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Admin User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAdminUser;
