import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditInstitution = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ime: "",
    adresa: "",
    kontakt: "",
    drzava: "",
    quotaStudents: 0,
    quotaProfessors: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInstitutionDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/ustanove/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setForm({
            ime: data.ime,
            adresa: data.adresa,
            kontakt: data.kontakt || "",
            drzava: data.drzava?._id || "",
            quotaStudents: data.quotaStudents,
            quotaProfessors: data.quotaProfessors,
          });
        } else {
          setError("Failed to fetch institution details.");
        }
      } catch (error) {
        setError("An error occurred while fetching institution details.");
      }
    };

    fetchInstitutionDetails();
  }, [id]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/ustanove/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        alert("Institution updated successfully!");
        navigate(`/institution-details/${id}`); // Navigate back to details page
      } else {
        const data = await response.json();
        setError("Error updating institution: " + data.message);
      }
    } catch (error) {
      setError("An error occurred while updating the institution.");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center fw-bold">Edit Institution</h1>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Edit Institution Form */}
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
            value={form.ime}
            onChange={handleFormChange}
            required
            className="form-control"
            placeholder="Enter institution name"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address:
          </label>
          <input
            type="text"
            name="adresa"
            value={form.adresa}
            onChange={handleFormChange}
            required
            className="form-control"
            placeholder="Enter institution address"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="contact" className="form-label">
            Contact:
          </label>
          <input
            type="text"
            name="kontakt"
            value={form.kontakt}
            onChange={handleFormChange}
            className="form-control"
            placeholder="Enter contact details"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Country ID:
          </label>
          <input
            type="text"
            name="drzava"
            value={form.drzava}
            onChange={handleFormChange}
            required
            className="form-control"
            placeholder="Enter country ID"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="quotaStudents" className="form-label">
            Quota for Students:
          </label>
          <input
            type="number"
            name="quotaStudents"
            value={form.quotaStudents}
            onChange={handleFormChange}
            required
            className="form-control"
            placeholder="Enter student quota"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="quotaProfessors" className="form-label">
            Quota for Professors:
          </label>
          <input
            type="number"
            name="quotaProfessors"
            value={form.quotaProfessors}
            onChange={handleFormChange}
            required
            className="form-control"
            placeholder="Enter professor quota"
          />
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/institution-details/${id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInstitution;
