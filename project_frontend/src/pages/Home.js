import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div
    className="container-fluid bg-light text-dark d-flex align-items-center justify-content-center"
    style={{ height: "80vh" }}
  >
    <div
      className="text-center p-5 bg-white rounded shadow-lg"
      style={{ width: "100%", maxWidth: "600px" }}
    >
      <h1 className="display-4 fw-bold mb-4 text-primary">
        Welcome to Erasmus Mobility Program
      </h1>
      <p className="lead mb-4">
        Your gateway to international education opportunities. Discover new
        institutions, connect with students and professors, and expand your
        horizons!
      </p>
      <div className="d-flex justify-content-center gap-3">
        <Link to="/login" className="btn btn-primary btn-lg">
          Login
        </Link>
        <Link to="/register" className="btn btn-outline-primary btn-lg">
          Register
        </Link>
      </div>
    </div>
  </div>
);

export default Home;
