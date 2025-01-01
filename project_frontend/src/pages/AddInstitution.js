import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddInstitution = () => {
	const [form, setForm] = useState({
		ime: "",
		adresa: "",
		kontakt: "",
		drzava: "",
		quotaStudents: 0,
		quotaProfessors: 0,
	});
	const [countries, setCountries] = useState([]);
	const [error, setError] = useState("");
	const token = localStorage.getItem("token");
	const navigate = useNavigate();

	useEffect(() => {
		fetchCountries();
	}, []);

	const fetchCountries = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/countries", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setCountries(data); // Assuming the response is an array of countries
			} else {
				setError("Failed to fetch countries.");
			}
		} catch (err) {
			setError("An error occurred while fetching countries.");
		}
	};

	const handleFormChange = (e) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
};

const handleSubmit = async (e) => {
	e.preventDefault();

	try {
		const response = await fetch("http://localhost:5000/api/ustanove", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(form),
		});

		if (response.ok) {
			alert("Institution added successfully!");
			navigate("/institutions");
		} else {
			const data = await response.json();
			setError(data.message || "Failed to add institution.");
		}
	} catch (error) {
		setError("An error occurred while adding the institution.");
	}
};

return (
	<div>
		<h1>Add Institution</h1>
		<form onSubmit={handleSubmit}>
			<input
type="text"
name="ime"
placeholder="Name"
value={form.ime}
onChange={handleFormChange}
required
/>
<input
type="text"
name="adresa"
placeholder="Address"
value={form.adresa}
onChange={handleFormChange}
required
/>
<input
type="text"
name="kontakt"
placeholder="Contact"
value={form.kontakt}
onChange={handleFormChange}
/>
<select
name="drzava"
value={form.drzava}
onChange={handleFormChange}
required
>
<option value="">Select Country</option>
{countries.map((country) => (
	<option key={country._id} value={country._id}>
		{country.naziv}
	</option>
    ))}
</select>
<input
type="number"
name="quotaStudents"
placeholder="Quota Students"
value={form.quotaStudents}
onChange={handleFormChange}
required
/>
<input
type="number"
name="quotaProfessors"
placeholder="Quota Professors"
value={form.quotaProfessors}
onChange={handleFormChange}
required
/>
<button type="submit">Add Institution</button>
</form>
{error && <p style={{ color: "red" }}>{error}</p>}
</div>
    );
};

export default AddInstitution;
