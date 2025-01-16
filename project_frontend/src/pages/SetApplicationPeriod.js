import React, { useEffect, useState } from "react";

const formatDate = (isoDate) => {
  if (!isoDate) return "Unknown";
  const date = new Date(isoDate);

  const day = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${day}`;
};

const SetApplicationPeriod = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [currentPeriod, setCurrentPeriod] = useState({});

  useEffect(() => {
    const fetchCurrentPeriod = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/application-period",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        setCurrentPeriod(data);
      } catch (error) {
        console.error("Error setting dates:", error);
        setMessage("Failed to set application period.");
      }
    };

    fetchCurrentPeriod();
  }, []);

  const handleSetDates = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/application-period",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ startDate, endDate }),
        }
      );

      const data = await response.json();
      console.log(data);
      setMessage(data.message || "Application period updated!");
      setCurrentPeriod({ startDate, endDate });
    } catch (error) {
      console.error("Error setting dates:", error);
      setMessage("Failed to set application period.");
    }
  };

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <h2 className="text-center mb-4">Set Application Period</h2>
      <h5 className="text-secondary text-center">
        Current Period:{" "}
        <span className="fw-bold">{formatDate(currentPeriod.startDate)}</span> -{" "}
        <span className="fw-bold">{formatDate(currentPeriod.endDate)}</span>
      </h5>
      {message && (
        <div
          className={`alert mt-4 ${
            message.includes("Failed") ? "alert-danger" : "alert-info"
          } text-center`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSetDates} className="mt-4">
        <div className="mb-3 d-flex flex-column align-items-center">
          <div className="mb-3" style={{ maxWidth: "300px", width: "100%" }}>
            <label htmlFor="startDate" className="form-label">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              className="form-control border-secondary"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-3" style={{ maxWidth: "300px", width: "100%" }}>
            <label htmlFor="endDate" className="form-label">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              className="form-control border-secondary"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-success px-4">
            <i className="bi bi-calendar-check-fill me-2"></i> Set Dates
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetApplicationPeriod;
