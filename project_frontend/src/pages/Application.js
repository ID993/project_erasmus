import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Application.css";

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

const Application = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gpa: "1.0",
    firstMobility: null,
    motivationLetter: null,
    englishProficiency: null,
    destinationLanguage: null,
    initiatedLLP: null,
    country: "",
    institution: "",
    program: "",
  });

  const [countries, setCountries] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [programs, setPrograms] = useState([]);

  const userToken = localStorage.getItem("token");
  const userRole = getUserRole(userToken);

  const [isLoggedIn, setIsLoggedIn] = useState(userToken ? true : false);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("You must be logged in to access the application form.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

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
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchCountries = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/countries/not-from",
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setCountries(data);
        } catch (error) {
          console.error("Error fetching countries:", error);
          setError("Failed to load countries.");
        }
      };

      fetchCountries();
    }
  }, [isLoggedIn, userToken]);

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value; // This should be the country name, not the ID
    setFormData({ ...formData, country: selectedCountry, institution: "" });

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/institutions/${selectedCountry}`, // Pass the country name here
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch institutions: ${response.status}`);
      }
      const data = await response.json();
      setInstitutions(data);
    } catch (error) {
      console.error("Error fetching institutions:", error);
      setError("Failed to load institutions.");
    }
  };

  const handleInstitutionChange = (e) => {
    setFormData({ ...formData, institution: e.target.value });
  };

  const handleProgramChange = (e) => {
    setFormData({ ...formData, program: e.target.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "yes" ? true : value === "no" ? false : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userToken) {
      alert("You must be logged in to submit the application.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          ...formData,
          userId: "loggedInUserId",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(
          `Application submitted successfully! Final Score: ${data.finalScore}`
        );
      } else {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while submitting the application.");
    } finally {
      setLoading(false);
    }
  };

  const RadioGroup = ({ label, name, value, onChange }) => (
    <div className="radio-group">
      <label>{label}</label>
      <div>
        <input
          type="radio"
          name={name}
          value="yes"
          checked={value === true}
          onChange={onChange}
        />
        Yes
      </div>
      <div>
        <input
          type="radio"
          name={name}
          value="no"
          checked={value === false}
          onChange={onChange}
        />
        No
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="application-container">
      <h2>Send Application</h2>
      {successMessage && <div className="alert success">{successMessage}</div>}
      {error && <div className="alert error">{error}</div>}

      <form onSubmit={handleSubmit} className="application-form">
        {userRole === "student" && (
          <div className="form-group">
            <label htmlFor="gpa">GPA (3.0 - 5.0):</label>
            <input
              type="number"
              id="gpa"
              name="gpa"
              value={formData.gpa}
              min="3.0"
              max="5.0"
              step="0.1"
              onChange={handleChange}
              required
              placeholder="Enter your GPA"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="country">Select Country:</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleCountryChange}
            required
          >
            <option value="">-- Select a Country --</option>
            {countries.map((country) => (
              <option key={country._id} value={country.naziv}>
                {" "}
                {/* Use country.naziv */}
                {country.naziv}
              </option>
            ))}
          </select>
        </div>

        {formData.country && (
          <div className="form-group">
            <label htmlFor="institution">Select Institution:</label>
            <select
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleInstitutionChange}
              required
            >
              <option value="">-- Select an Institution --</option>
              {institutions.length > 0 ? (
                institutions.map((institution) => (
                  <option key={institution._id} value={institution._id}>
                    {institution.ime}{" "}
                    {/* Render the 'ime' of the institution */}
                  </option>
                ))
              ) : (
                <option>No institutions found</option>
              )}
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="program">Select Program:</label>
          <select
            id="program"
            name="program"
            value={formData.program}
            onChange={handleProgramChange}
            required
          >
            <option value="">-- Select a program --</option>
            {programs.length > 0 ? (
              programs.map((program) => (
                <option key={program._id} value={program._id}>
                  {program.naziv}
                </option>
              ))
            ) : (
              <option>No program found</option>
            )}
          </select>
        </div>

        <RadioGroup
          label="First Mobility:"
          name="firstMobility"
          value={formData.firstMobility}
          onChange={handleChange}
        />
        <RadioGroup
          label="Motivation Letter Approved:"
          name="motivationLetter"
          value={formData.motivationLetter}
          onChange={handleChange}
        />
        <RadioGroup
          label="English Proficiency Met:"
          name="englishProficiency"
          value={formData.englishProficiency}
          onChange={handleChange}
        />
        <RadioGroup
          label="Destination Language Proficiency Met:"
          name="destinationLanguage"
          value={formData.destinationLanguage}
          onChange={handleChange}
        />
        <RadioGroup
          label="Initiated LLP Agreement:"
          name="initiatedLLP"
          value={formData.initiatedLLP}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default Application;
