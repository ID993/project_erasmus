import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../Modal";

const InstitutionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState(null);
  const [entityName, setEntityName] = useState("");

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
          setInstitution(data);
        } else {
          setError("Failed to fetch institution details.");
        }
      } catch (error) {
        setError("An error occurred while fetching institution details.");
      }
    };

    fetchInstitutionDetails();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit-institution/${id}`); // Redirect to edit page
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShowModal = (entityId, name) => {
    setDeleteEntityId(entityId);
    setEntityName(name);
    setShowModal(true); // Show the modal
  };

  const handleDelete = async () => {
    // if (!window.confirm("Are you sure you want to delete this institution?"))
    //   return;

    try {
      const response = await fetch(`http://localhost:5000/api/ustanove/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        //alert("Institution deleted successfully!");
        setShowModal(false);
        navigate("/institutions"); // Redirect to institutions list
      } else {
        const data = await response.json();
        setError("Error deleting institution: " + data.message);
      }
    } catch (error) {
      setError("An error occurred while deleting the institution.");
    }
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!institution) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <div className="container p-4 bg-light rounded shadow text-center">
        <h2 className="mb-4 fw-bold">Institution Details</h2>
        <div className="text-center">
          <p>
            <strong>Name:</strong> {institution.ime}
          </p>
          <p>
            <strong>Address:</strong> {institution.adresa}
          </p>
          <p>
            <strong>Contact:</strong> {institution.kontakt || "N/A"}
          </p>
          <p>
            <strong>Country:</strong> {institution.drzava?.naziv || "Unknown"}
          </p>
          <p>
            <strong>Quota for Students:</strong> {institution.quotaStudents}
          </p>
          <p>
            <strong>Quota for Professors:</strong> {institution.quotaProfessors}
          </p>
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button className="btn btn-primary" onClick={handleEdit}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={handleShowModal}>
              Delete
            </button>
            <Modal
              showModal={showModal}
              handleClose={handleClose}
              deleteAction={() => handleDelete(institution._id)}
              entityId={deleteEntityId}
              entityName={entityName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetails;
