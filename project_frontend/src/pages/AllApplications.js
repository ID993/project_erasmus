import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const getUserRole = (token) => {
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
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

const AllApplications = () => {
  const [prijave, setPrijave] = useState([]);
  const [prijaveProfesor, setPrijaveProfesor] = useState([]);
  const [displayedApplications, setDisplayedApplications] = useState([]);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");
  const userRole = getUserRole(token);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/application/all-applications",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          if (userRole === "admin") {
            setPrijave(data.data.prijave || []);
            setPrijaveProfesor(data.data.prijaveProfesor || []);
          } else if (userRole === "student") {
            setPrijave(data.data || []);
          } else if (userRole === "profesor") {
            setPrijaveProfesor(data.data || []);
          }
        } else {
          console.error("Error fetching applications:", data.message);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    fetchApplications();
  }, [token, userRole]);

  useEffect(() => {
    if (!userRole) return;
    if (userRole === "admin") {
      if (filter === "students") {
        setDisplayedApplications(prijave);
      } else if (filter === "professors") {
        setDisplayedApplications(prijaveProfesor);
      } else {
        setDisplayedApplications([...prijave, ...prijaveProfesor]);
      }
    } else if (userRole === "student") {
      setDisplayedApplications(prijave);
    } else if (userRole === "profesor") {
      setDisplayedApplications(prijaveProfesor);
    }
  }, [filter, prijave, prijaveProfesor, userRole]);

  const handleFilterChange = (type) => {
    setFilter(type);
  };

  return (
    <div>
      <h1>Applications</h1>

      {/* Admin Filter Buttons */}
      {userRole === "admin" && (
        <div>
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => handleFilterChange("all")}
          >
            All Applications
          </button>
          <button
            className={filter === "students" ? "active" : ""}
            onClick={() => handleFilterChange("students")}
          >
            Student Applications
          </button>
          <button
            className={filter === "professors" ? "active" : ""}
            onClick={() => handleFilterChange("professors")}
          >
            Professor Applications
          </button>
        </div>
      )}

      {/* Table of Applications */}
      <table border="1" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {displayedApplications.map((application) => (
            <tr key={application._id}>
              <td>{application._id}</td>
              <td>{application.user?.ime || "Unknown"}</td>
              <td>{application.user?.prezime || "Unknown"}</td>
              <td>{application.user?.email || "Unknown"}</td>
              <td>{application.status || "Unknown"}</td>
              <td>{formatDate(application.createdAt) || "Unknown"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllApplications;
