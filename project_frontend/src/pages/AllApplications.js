import React, { useEffect, useState } from "react";

const getUserRole = (token) => {
  if (!token) return null;

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken.uloga;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

const formatDate = (isoDate) => {
  if (!isoDate) return "Unknown";
  const date = new Date(isoDate);

  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const day = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${time}, ${day}`;
};

const triggerEvaluation = async (applications) => {
  console.log("Triggering evaluation for all applications.");
  const institutionIds = [
    ...new Set(applications.map((app) => app.ustanova?._id)),
  ].filter((id) => id);

  if (!institutionIds.length) {
    alert("No valid institutions found for evaluation.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/applications/evaluate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ institutionIds, role: "all" }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      //alert(data.message);

      return { successMessage: "Applications evaluated succesfully." };
    } else {
      console.error("Backend Error:", data.message);
      //alert(data.message || "Failed to evaluate applications.");
      return { error: data.message || "Failed to evaluate applications." };
    }
  } catch (error) {
    console.error("Error occurred during evaluation:", error);
    return { error: "Error occurred during evaluation." };
  }
};

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");
  const userRole = getUserRole(token);

  const fetchApplications = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/applications/get-all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setApplications(data.data || []);
      } else {
        console.error("Error fetching applications:", data.message);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };
  useEffect(() => {
    fetchApplications();
  });

  const handleFilterChange = (type) => {
    setFilter(type);
  };

  const handleEvaluation = async () => {
    setIsEvaluating(true);
    setError(null);
    setSuccessMessage("");
    const result = await triggerEvaluation(applications);
    if (result.successMessage) {
      setSuccessMessage(result.successMessage);
      fetchApplications();
    } else if (result.error) {
      setError(result.error);
    }
    setIsEvaluating(false);
  };

  const handleConfirmation = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/applications/confirm-application/${applicationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);

        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app._id === applicationId
              ? { ...app, status: "confirmed" }
              : { ...app, status: "declined" }
          )
        );
      } else {
        setError(data.message || "Failed to confirm application.");
      }
    } catch (error) {
      console.error("Error confirming application:", error);
      setError("An error occurred while confirming the application.");
    }
  };

  const filteredApplications = applications.filter((application) => {
    if (filter === "students") {
      return application.user?.uloga.some((role) => role.naziv === "student");
    }
    if (filter === "professors") {
      return application.user?.uloga.some((role) => role.naziv === "profesor");
    }
    return true;
  });

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 fw-bold">Applications</h1>

      {/* Admin Filters and Evaluate Button */}
      {userRole === "admin" && (
        <>
          <div className="btn-group mb-4 d-flex justify-content-center">
            <button
              className={`btn btn-outline-primary ${
                filter === "all" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("all")}
            >
              All Applications
            </button>
            <button
              className={`btn btn-outline-primary ${
                filter === "students" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("students")}
            >
              Student Applications
            </button>
            <button
              className={`btn btn-outline-primary ${
                filter === "professors" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("professors")}
            >
              Professor Applications
            </button>
          </div>

          <div className="d-flex justify-content-center mb-4">
            <button
              className="btn btn-success"
              onClick={handleEvaluation}
              disabled={isEvaluating}
            >
              {isEvaluating ? "Evaluating..." : "Evaluate All Applications"}
            </button>
          </div>

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
        </>
      )}

      {/* Applications Table */}
      {filteredApplications.length === 0 ? (
        <div className="alert alert-info text-center">
          {filter === "students"
            ? "No student applications found."
            : filter === "professors"
            ? "No professor applications found."
            : "No applications available."}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Institution</th>
                <th>Program</th>
                {userRole === "admin" && (
                  <>
                    <th>Confirmed Students</th>
                    <th>Confirmed Professors</th>
                    <th>Quota Students</th>
                    <th>Quota Professors</th>
                  </>
                )}
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date</th>
                {userRole !== "admin" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((application) => (
                <tr key={application._id}>
                  <td>{application.ustanova?.ime || "No Institution"}</td>
                  <td>{application.program?.naziv || "No Program"}</td>
                  {userRole === "admin" && (
                    <>
                      <td>
                        {application.ustanova?.applicationsAcceptedStudents ||
                          0}
                      </td>
                      <td>
                        {application.ustanova?.applicationsAcceptedProfessors ||
                          0}
                      </td>
                      <td>
                        {application.ustanova?.quotaStudents || "Unknown"}
                      </td>
                      <td>
                        {application.ustanova?.quotaProfessors || "Unknown"}
                      </td>
                    </>
                  )}
                  <td>{application.user?.ime || "Unknown"}</td>
                  <td>{application.user?.prezime || "Unknown"}</td>
                  <td>{application.user?.email || "Unknown"}</td>
                  <td>{application.user?.uloga?.[0]?.naziv || "Unknown"}</td>
                  <td>{application.status || "Unknown"}</td>
                  <td>{formatDate(application.createdAt) || "Unknown"}</td>
                  {userRole !== "admin" && (
                    <td>
                      <button
                        className={`btn btn-sm ${
                          application.status === "confirmed"
                            ? "btn-success"
                            : application.status === "declined"
                            ? "btn-danger"
                            : application.status === "sent"
                            ? "btn-secondary"
                            : "btn-primary"
                        }`}
                        disabled={
                          application.status === "confirmed" ||
                          application.status === "declined" ||
                          application.status === "sent"
                        }
                        onClick={() => handleConfirmation(application._id)}
                      >
                        {application.status === "confirmed"
                          ? "Confirmed"
                          : application.status === "declined"
                          ? "Declined"
                          : application.status === "sent"
                          ? "Sent"
                          : "Confirm"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllApplications;
