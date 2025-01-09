import React, { useState } from "react";

const Prijava = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                alert("Uspješna prijava!");
            } else {
                setError("Neispravni podaci za prijavu");
            }
        } catch (error) {
            setError("Greška pri spajanju na server");
        }
    };

    return (
        <div>
            <h1>Prijava</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Lozinka"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button type="submit">Prijavi se</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Prijava;