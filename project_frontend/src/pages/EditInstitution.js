import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditInstitution = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [form, setForm] = useState({
		ime: "",
		adresa: "",
		kontakt: "",
		drzava: "",
		quotaStudents: 0,
		quotaProfessors: 0,
	});
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
					setForm({
						ime: data.ime,
						adresa: data.adresa,
						kontakt: data.kontakt || "",
						drzava: data.drzava?._id || "",
						quotaStudents: data.quotaStudents,
						quotaProfessors: data.quotaProfessors,
					});
				} else {
					setError("Failed to fetch institution details.");
				}
			} catch (error) {
				setError("An error occurred while fetching institution details.");
			}
		};

		fetchInstitutionDetails();
	}, [id]);

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(`http://localhost:5000/api/ustanove/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify(form),
			});
			if (response.ok) {
				alert("Institution updated successfully!");
				navigate(`/institution-details/${id}`); // Navigate back to details page
			} else {
				const data = await response.json();
				setError("Error updating institution: " + data.message);
			}
		} catch (error) {
			setError("An error occurred while updating the institution.");
		}
	};

	return (
		<div>
			<h1>Edit Institution</h1>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<form onSubmit={handleSubmit}>
				<div>
					<label>Name:</label>
					<input
						type="text"
						name="ime"
						value={form.ime}
						onChange={handleFormChange}
						required
					/>
				</div>
				<div>
					<label>Address:</label>
					<input
						type="text"
						name="adresa"
						value={form.adresa}
						onChange={handleFormChange}
						required
					/>
				</div>
				<div>
					<label>Contact:</label>
					<input
						type="text"
						name="kontakt"
						value={form.kontakt}
						onChange={handleFormChange}
					/>
				</div>
				<div>
					<label>Country ID:</label>
					<input
						type="text"
						name="drzava"
						value={form.drzava}
						onChange={handleFormChange}
						required
					/>
				</div>
				<div>
					<label>Quota Students:</label>
					<input
						type="number"
						name="quotaStudents"
						value={form.quotaStudents}
						onChange={handleFormChange}
						required
					/>
				</div>
				<div>
					<label>Quota Professors:</label>
					<input
						type="number"
						name="quotaProfessors"
						value={form.quotaProfessors}
						onChange={handleFormChange}
						required
					/>
				</div>
				<button type="submit">Save Changes</button>
				<button type="button" onClick={() => navigate(`/institution-details/${id}`)}>
					Cancel
				</button>
			</form>
		</div>
	);
};

export default EditInstitution;
