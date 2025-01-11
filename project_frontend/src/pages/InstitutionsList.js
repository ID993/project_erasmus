import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1])); // Decode the token
  } catch (e) {
    return null;
  }
};

const InstitutionsList = () => {
  const [institutions, setInstitutions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const userId = token ? parseJwt(token).korisnik_id : null;
  const userRole = token ? parseJwt(token).uloga : null;

  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    filterInstitutions();
  }, [searchQuery, institutions]);

  const fetchInstitutions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ustanove", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setInstitutions(data.data);
        setFilteredInstitutions(data.data);
      } else {
        setError("Error fetching institutions: " + data.message);
      }
    } catch (error) {
      setError("Error fetching institutions: " + error.message);
    }
  };

  const filterInstitutions = () => {
    if (searchQuery.trim() === "") {
      setFilteredInstitutions(institutions);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = institutions.filter(
        (institution) =>
          institution.ime.toLowerCase().includes(lowercasedQuery) ||
          institution.adresa.toLowerCase().includes(lowercasedQuery) ||
          institution.kontakt?.toLowerCase().includes(lowercasedQuery) ||
          institution.drzava?.naziv.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredInstitutions(filtered);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setError(""); // Clear error when user starts typing
  };

  const handleClose = () => {
    setShowModal(false);
    setInstitutionToDelete(null);
  };

  const handleShowModal = (institutionId) => {
    setInstitutionToDelete(institutionId);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this institution?"))
    //   return;

    try {
      const response = await fetch(`http://localhost:5000/api/ustanove/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        //alert("Institution deleted successfully!");
        fetchInstitutions(); // Refresh the list
        setShowModal(false);
      } else {
        const data = await response.json();
        setError("Error deleting institution: " + data.message);
      }
    } catch (error) {
      setError("Error deleting institution: " + error.message);
    }
  };

  const handleDetails = (id) => {
    navigate(`/institution-details/${id}`);
  };

  const handleAddInstitution = () => {
    navigate("/add-institution");
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 fw-bold">Institutions</h1>

      {/* Search and Add Institution Button */}
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search institutions..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {userRole === "admin" && (
          <button className="btn btn-success" onClick={handleAddInstitution}>
            Add Institution
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {/* Institutions Table */}
      {filteredInstitutions.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          No institutions available.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Country</th>
                <th>Quota Students</th>
                <th>Quota Professors</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstitutions.map((institution) => (
                <tr key={institution._id}>
                  <td>{institution.ime}</td>
                  <td>{institution.adresa}</td>
                  <td>{institution.kontakt || "N/A"}</td>
                  <td>{institution.drzava?.naziv || "Unknown"}</td>
                  <td>{institution.quotaStudents}</td>
                  <td>{institution.quotaProfessors}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleDetails(institution._id)}
                      >
                        Details
                      </button>
                      {userRole === "admin" && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={handleShowModal}
                        >
                          Delete
                        </button>
                      )}
                      <Modal
                        showModal={showModal}
                        handleClose={handleClose}
                        deleteAction={() => handleDelete(institution._id)}
                        entityId={institutionToDelete}
                        entityName="institution"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InstitutionsList;
