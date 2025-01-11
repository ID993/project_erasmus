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
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
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
    const fetchApplicationPeriod = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/application-period",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        const period = await response.json();

        if (response.ok) {
          console.log("Fetched period:", period);
          const currentDate = new Date();
          const startDate = new Date(period.startDate);
          const endDate = new Date(period.endDate);

          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            setError("The application period dates are invalid.");
            return;
          }

          if (currentDate >= startDate && currentDate <= endDate) {
            setIsApplicationOpen(true);
          } else {
            setIsApplicationOpen(false);
            setError(
              `Applications are closed. The period was from ${formatDate(
                startDate
              )} to ${formatDate(endDate)}.`
            );
          }
        } else {
          setError(period.message || "Failed to fetch application period.");
        }
      } catch (error) {
        console.error("Error fetching application period:", error);
        setError("Failed to fetch application dates.");
      }
    };

    fetchApplicationPeriod();
  }, [userToken]);

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
              headers: { Authorization: `Bearer ${userToken}` },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching countries:", errorData.message);
            setError(errorData.message || "Failed to load countries.");
            return;
          }

          const data = await response.json();
          //console.log("Fetched countries:", data); // Debug log
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
    const selectedCountry = e.target.value;
    setFormData({ ...formData, country: selectedCountry, institution: "" });

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/institutions/${selectedCountry}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
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

  const handleInstitutionChange = async (e) => {
    const selectedInstitution = institutions.find(
      (institution) => institution._id === e.target.value
    );
    if (selectedInstitution.quota <= selectedInstitution.applicationsAccepted) {
      setError("Quota exceeded for the selected institution.");
      return;
    }
    setFormData({ ...formData, institution: selectedInstitution._id });
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
    if (!isApplicationOpen) {
      alert("Applications are closed.");
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
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold">Send Application</h2>

      {/* Show success and error messages */}
      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}
      {error && (
        <div
          className={`alert text-center ${
            isApplicationOpen ? "alert-warning" : "alert-danger"
          }`}
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Show the application form only if there is no error */}

      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: "600px" }}
      >
        {userRole === "student" && (
          <div className="mb-3">
            <label htmlFor="gpa" className="form-label">
              GPA (3.0 - 5.0):
            </label>
            <input
              type="number"
              id="gpa"
              name="gpa"
              className="form-control"
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

        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Select Country:
          </label>
          <select
            id="country"
            name="country"
            className="form-select"
            value={formData.country}
            onChange={handleCountryChange}
            required
          >
            <option value="">-- Select a Country --</option>
            {countries.map((country) => (
              <option key={country._id} value={country.naziv}>
                {country.naziv}
              </option>
            ))}
          </select>
        </div>

        {formData.country && (
          <div className="mb-3">
            <label htmlFor="institution" className="form-label">
              Select Institution:
            </label>
            <select
              id="institution"
              name="institution"
              className="form-select"
              value={formData.institution}
              onChange={handleInstitutionChange}
              required
            >
              <option value="">-- Select an Institution --</option>
              {institutions.length > 0 ? (
                institutions.map((institution) => (
                  <option key={institution._id} value={institution._id}>
                    {institution.ime}
                  </option>
                ))
              ) : (
                <option>No institutions found</option>
              )}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="program" className="form-label">
            Select Program:
          </label>
          <select
            id="program"
            name="program"
            className="form-select"
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

        <div className="mb-3">
          <label className="form-label">First Mobility:</label>
          <RadioGroup
            name="firstMobility"
            value={formData.firstMobility}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Motivation Letter Approved:</label>
          <RadioGroup
            name="motivationLetter"
            value={formData.motivationLetter}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">English Proficiency Met:</label>
          <RadioGroup
            name="englishProficiency"
            value={formData.englishProficiency}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            Destination Language Proficiency Met:
          </label>
          <RadioGroup
            name="destinationLanguage"
            value={formData.destinationLanguage}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Initiated LLP Agreement:</label>
          <RadioGroup
            name="initiatedLLP"
            value={formData.initiatedLLP}
            onChange={handleChange}
          />
        </div>

        <div className="d-grid">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Application;
