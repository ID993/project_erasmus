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
  const [roles, setRoles] = useState({});
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");
  const userRole = getUserRole(token);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/roles", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data) {
          const rolesMap = data.reduce((map, role) => {
            map[role.naziv] = role._id;
            return map;
          }, {});
          console.log(rolesMap);
          setRoles(rolesMap);
        } else {
          console.error("Error fetching roles:", data.message);
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/applications/get-all",
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
          setPrijave(data.data || []);
        } else {
          console.error("Error fetching applications:", data.message);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };
    fetchRoles();
    fetchApplications();
  }, [token]);

  const handleFilterChange = (type) => {
    setFilter(type);
  };

  const filteredApplications = prijave.filter((application) => {
    if (filter === "students") {
      return application.user?.uloga.includes(roles.student);
    }
    if (filter === "professors") {
      return application.user?.uloga.includes(roles.profesor);
    }
    return true;
  });

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
            <th>Applied to Institution</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.map((application) => (
            <tr key={application._id}>
              <td>{application._id}</td>
              <td>{application.ustanova?.ime}</td>
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
