import React from "react";
import { Link } from "react-router-dom";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1])); // Decode the token
  } catch (e) {
    return null;
  }
};

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const userId = token ? parseJwt(token).korisnik_id : null;
  const userRole = token ? parseJwt(token).uloga : null;
  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center text-center py-5 bg-light rounded shadow mt-4"
      style={{ height: "70vh" }}
    >
      <h2 className="display-5 fw-bold mb-3 text-primary">
        Welcome to Your Dashboard
      </h2>
      <p className="lead mb-4">
        Here you can manage your profile and applications.
      </p>

      <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
        <Link to={`/user-profile/${userId}`} className="btn btn-primary btn-lg">
          My Profile
        </Link>
        {userRole !== "admin" && (
          <Link to="/application" className="btn btn-outline-primary btn-lg">
            Submit Application
          </Link>
        )}

        {userRole === "admin" && (
          <Link to="/all-applications" className="btn btn-secondary btn-lg">
            All Applications
          </Link>
        )}
        {userRole !== "admin" && (
          <Link to="/all-applications" className="btn btn-secondary btn-lg">
            My Applications
          </Link>
        )}

        <Link to="/institutions" className="btn btn-info btn-lg text-white">
          Explore Institutions
        </Link>
        {userRole === "admin" && (
          <Link to="/all-users" className="btn btn-success btn-lg">
            Manage Users
          </Link>
        )}
        {userRole === "admin" && (
          <Link to="/set-period" className="btn btn-danger btn-lg">
            Set Application Period
          </Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
