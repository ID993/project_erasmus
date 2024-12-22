import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const getUserInfo = (token) => {
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

const ProfessorApplication = () => {
  const [programs, setPrograms] = useState([]);
  const [ustanovas, setUstanovas] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedUstanova, setSelectedUstanova] = useState("");
  const [message, setMessage] = useState("");
  const userToken = localStorage.getItem("token");
  const userRole = getUserInfo(userToken).uloga;

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const programResponse = await fetch(
          "http://localhost:5000/api/programi/by-role",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const programData = await programResponse.json();
        setPrograms(programData.data);

        const ustanovaResponse = await fetch(
          "http://localhost:5000/api/ustanove/not-from",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const ustanovaData = await ustanovaResponse.json();
        setUstanovas(ustanovaData.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProgram || !selectedUstanova) {
      setMessage("Please select both a Program and an Ustanova.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/professor-application/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            program: selectedProgram,
            ustanova: selectedUstanova,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Application submitted successfully!");
      } else {
        setMessage(data.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  if (userRole !== "profesor") {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <div>
      <h1>Submit Erasmus Application</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Program:</label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            required
          >
            <option value="">Select a Program</option>
            {programs.map((program) => (
              <option key={program._id} value={program._id}>
                {program.naziv}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Ustanova:</label>
          <select
            value={selectedUstanova}
            onChange={(e) => setSelectedUstanova(e.target.value)}
            required
          >
            <option value="">Select an Ustanova</option>
            {ustanovas.map((ustanova) => (
              <option key={ustanova._id} value={ustanova._id}>
                {ustanova.ime}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProfessorApplication;
