import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddInstitution = () => {
  const [form, setForm] = useState({
    ime: "",
    adresa: "",
    kontakt: "",
    drzava: "",
    quotaStudents: 0,
    quotaProfessors: 0,
  });
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/countries", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCountries(data); // Assuming the response is an array of countries
      } else {
        setError("Failed to fetch countries.");
      }
    } catch (err) {
      setError("An error occurred while fetching countries.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/ustanove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        //alert("Institution added successfully!");
        setSuccessMessage("Institution added successfully!");
        setTimeout(() => {
          navigate("/institutions");
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to add institution.");
      }
    } catch (error) {
      setError("An error occurred while adding the institution.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 fw-bold">Add Institution</h1>
      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            name="ime"
            className="form-control"
            placeholder="Enter institution name"
            value={form.ime}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address:
          </label>
          <input
            type="text"
            name="adresa"
            className="form-control"
            placeholder="Enter institution address"
            value={form.adresa}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contact" className="form-label">
            Contact:
          </label>
          <input
            type="text"
            name="kontakt"
            className="form-control"
            placeholder="Enter contact details"
            value={form.kontakt}
            onChange={handleFormChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Country:
          </label>
          <select
            name="drzava"
            className="form-select"
            value={form.drzava}
            onChange={handleFormChange}
            required
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country._id} value={country._id}>
                {country.naziv}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="quotaStudents" className="form-label">
            Quota for Students:
          </label>
          <input
            type="number"
            name="quotaStudents"
            className="form-control"
            placeholder="Enter student quota"
            value={form.quotaStudents}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="quotaProfessors" className="form-label">
            Quota for Professors:
          </label>
          <input
            type="number"
            name="quotaProfessors"
            className="form-control"
            placeholder="Enter professor quota"
            value={form.quotaProfessors}
            onChange={handleFormChange}
            required
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary btn-lg">
            Add Institution
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger mt-4 text-center" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default AddInstitution;
