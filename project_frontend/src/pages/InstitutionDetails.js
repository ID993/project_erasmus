import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const InstitutionDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [institution, setInstitution] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchInstitutionDetails = async () => {
			try {
				const response = await fetch(`http://localhost:5000/api/ustanove/${id}`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				if (response.ok) {
					const data = await response.json();
					setInstitution(data);
				} else {
					setError("Failed to fetch institution details.");
				}
			} catch (error) {
				setError("An error occurred while fetching institution details.");
			}
		};

		fetchInstitutionDetails();
	}, [id]);

	const handleEdit = () => {
		navigate(`/edit-institution/${id}`); // Redirect to edit page
	};

	const handleDelete = async () => {
		if (!window.confirm("Are you sure you want to delete this institution?")) return;

		try {
			const response = await fetch(`http://localhost:5000/api/ustanove/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			if (response.ok) {
				alert("Institution deleted successfully!");
				navigate("/institutions"); // Redirect to institutions list
			} else {
				const data = await response.json();
				setError("Error deleting institution: " + data.message);
			}
		} catch (error) {
			setError("An error occurred while deleting the institution.");
		}
	};

	if (error) {
		return <p style={{ color: "red" }}>{error}</p>;
}

if (!institution) {
	return <p>Loading...</p>;
}

return (
	<div>
		<h1>{institution.ime}</h1>
		<p><strong>Address:</strong> {institution.adresa}</p>
		<p><strong>Contact:</strong> {institution.kontakt || "N/A"}</p>
		<p><strong>Country:</strong> {institution.drzava?.naziv || "Unknown"}</p>
		<p><strong>Quota Students:</strong> {institution.quotaStudents}</p>
		<p><strong>Quota Professors:</strong> {institution.quotaProfessors}</p>
		<div>
				<button onClick={handleEdit} style={{ marginRight: "10px" }}>
					Edit
				</button>
				<button onClick={handleDelete} style={{ backgroundColor: "red", color: "white" }}>
					Delete
				</button>
		</div>
	</div>
    );
};

export default InstitutionDetails;
