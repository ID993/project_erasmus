import React, { useState } from "react";
import './Application.css';  // Import the CSS for styling

const Application = () => {
    const [formData, setFormData] = useState({
        gpa: "",
        firstMobility: null,
        motivationLetter: null,
        englishProficiency: null,
        destinationLanguage: null,
        initiatedLLP: null,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value === "yes" ? true : value === "no" ? false : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (formData.gpa < 3.0 || formData.gpa > 5.0) {
            alert("GPA must be between 3.0 and 5.0.");
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
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessMessage(`Application submitted successfully! Final Score: ${data.finalScore}`);
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

    return (
        <div className="application-container">
            <h2>Send Application</h2>
            {successMessage && <div className="alert success">{successMessage}</div>}
            {error && <div className="alert error">{error}</div>}

            <form onSubmit={handleSubmit} className="application-form">
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
