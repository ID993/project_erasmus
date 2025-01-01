import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Institutions = () => {
    const [institutions, setInstitutions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredInstitutions, setFilteredInstitutions] = useState([]);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchInstitutions();
    }, []);

    useEffect(() => {
        filterInstitutions();
    }, [searchQuery, institutions]);

    const fetchInstitutions = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/ustanove", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setInstitutions(data.data);
                setFilteredInstitutions(data.data);
            } else {
                setError("Error fetching institutions: " + data.message);
            }
        } catch (error) {
            setError("Error fetching institutions: " + error.message);
        }
    };

    const filterInstitutions = () => {
        if (searchQuery.trim() === "") {
            setFilteredInstitutions(institutions);
        } else {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filtered = institutions.filter((institution) =>
                institution.ime.toLowerCase().includes(lowercasedQuery) ||
                institution.adresa.toLowerCase().includes(lowercasedQuery) ||
                institution.kontakt?.toLowerCase().includes(lowercasedQuery) ||
                institution.drzava?.naziv.toLowerCase().includes(lowercasedQuery)
            );
            setFilteredInstitutions(filtered);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setError(""); // Clear error when user starts typing
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this institution?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/ustanove/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Institution deleted successfully!");
                fetchInstitutions(); // Refresh the list
            } else {
                const data = await response.json();
                setError("Error deleting institution: " + data.message);
            }
        } catch (error) {
            setError("Error deleting institution: " + error.message);
        }
    };

    const handleDetails = (id) => {
        navigate(`/institution-details/${id}`);
    };

    const handleAddInstitution = () => {
        navigate("/add-institution");
    };

    return (
        <div>
            <h1>Institutions</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search institutions..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button onClick={handleAddInstitution}>Add Institution</button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {filteredInstitutions.length === 0 ? (
                <p>No institutions available.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Contact</th>
                            <th>Country</th>
                            <th>Quota Students</th>
                            <th>Quota Professors</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInstitutions.map((institution) => (
                            <tr key={institution._id}>
                                <td>{institution.ime}</td>
                                <td>{institution.adresa}</td>
                                <td>{institution.kontakt || "N/A"}</td>
                                <td>{institution.drzava?.naziv || "Unknown"}</td>
                                <td>{institution.quotaStudents}</td>
                                <td>{institution.quotaProfessors}</td>
                                <td>
                                    <button onClick={() => handleDetails(institution._id)}>Details</button>
                                    <button onClick={() => handleDelete(institution._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Institutions;
