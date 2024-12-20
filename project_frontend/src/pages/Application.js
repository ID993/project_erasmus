import React, { useState } from 'react';

const Application = () => {
    const [formData, setFormData] = useState({
        gpa: '',
        firstMobility: null, // Change to null to represent no selection initially
        motivationLetter: null,
        englishProficiency: null,
        destinationLanguage: null,
        initiatedLLP: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value === 'yes' ? true : value === 'no' ? false : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Application submitted successfully! Final Score: ${data.finalScore}`);
            } else {
                const error = await response.json();
                alert(`Error submitting application: ${error.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the application.');
        }
    };

    return (
        <div className="application-container">
            <h2>Send Application</h2>
            <form onSubmit={handleSubmit} className="application-form">
                <label>
                    GPA (3.0 - 5.0):
                    <input
                        type="number"
                        name="gpa"
                        value={formData.gpa}
                        min="3.0"
                        max="5.0"
                        step="0.1"
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    First Mobility:
                    <div>
                        <input
                            type="radio"
                            name="firstMobility"
                            value="yes"
                            checked={formData.firstMobility === true}
                            onChange={handleChange}
                        />
                        Yes
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="firstMobility"
                            value="no"
                            checked={formData.firstMobility === false}
                            onChange={handleChange}
                        />
                        No
                    </div>
                </label>

                <label>
                    Motivation Letter Approved:
                    <div>
                        <input
                            type="radio"
                            name="motivationLetter"
                            value="yes"
                            checked={formData.motivationLetter === true}
                            onChange={handleChange}
                        />
                        Yes
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="motivationLetter"
                            value="no"
                            checked={formData.motivationLetter === false}
                            onChange={handleChange}
                        />
                        No
                    </div>
                </label>

                <label>
                    English Proficiency Met:
                    <div>
                        <input
                            type="radio"
                            name="englishProficiency"
                            value="yes"
                            checked={formData.englishProficiency === true}
                            onChange={handleChange}
                        />
                        Yes
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="englishProficiency"
                            value="no"
                            checked={formData.englishProficiency === false}
                            onChange={handleChange}
                        />
                        No
                    </div>
                </label>

                <label>
                    Destination Language Proficiency Met:
                    <div>
                        <input
                            type="radio"
                            name="destinationLanguage"
                            value="yes"
                            checked={formData.destinationLanguage === true}
                            onChange={handleChange}
                        />
                        Yes
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="destinationLanguage"
                            value="no"
                            checked={formData.destinationLanguage === false}
                            onChange={handleChange}
                        />
                        No
                    </div>
                </label>

                <label>
                    Initiated LLP Agreement:
                    <div>
                        <input
                            type="radio"
                            name="initiatedLLP"
                            value="yes"
                            checked={formData.initiatedLLP === true}
                            onChange={handleChange}
                        />
                        Yes
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="initiatedLLP"
                            value="no"
                            checked={formData.initiatedLLP === false}
                            onChange={handleChange}
                        />
                        No
                    </div>
                </label>

                <button type="submit">Submit Application</button>
            </form>
        </div>
    );
};

export default Application;
