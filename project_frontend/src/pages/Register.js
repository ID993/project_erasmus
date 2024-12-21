import React, { useState, useEffect } from "react";

const Register = () => {
    const [userCredentials, setUserCredentials] = useState({
        ime: "",
        prezime: "",
        email: "",
        sifra: "",
        ustanova: "",
        uloga: "",
    });
    const [institutions, setInstitutions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Fetch institutions and roles
        const fetchData = async () => {
            try {
                const institutionsRes = await fetch("http://localhost:5000/api/auth/institutions");
                const rolesRes = await fetch("http://localhost:5000/api/auth/roles");

                const institutionsData = await institutionsRes.json();
                const rolesData = await rolesRes.json();

                // Filter out "Admin" role
                const filteredRoles = rolesData.filter(role => role.naziv !== "admin");

                setInstitutions(institutionsData);
                setRoles(filteredRoles);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userCredentials),
            });

            const data = await response.json();

            if (response.status === 201) {
                setSuccess(true);
                alert("User registered successfully");
            } else {
                setError(data.message || "Failed to register");
            }
        } catch (err) {
            setError("Failed to connect to the server");
            console.error("Registration Error:", err);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6 py-10 px-4 bg-gray-50">
            <h2 className="text-2xl font-bold">Register</h2>
            {success && <div>Registration successful! Please login.</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            <form onSubmit={handleRegister} className="flex flex-col space-y-4 w-full max-w-md">
                <input
                    type="text"
                    name="ime"
                    value={userCredentials.ime}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <input
                    type="text"
                    name="prezime"
                    value={userCredentials.prezime}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <input
                    type="email"
                    name="email"
                    value={userCredentials.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <input
                    type="password"
                    name="sifra"
                    value={userCredentials.sifra}
                    onChange={handleChange}
                    placeholder="Password"
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <select
                    name="ustanova"
                    value={userCredentials.ustanova}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                >
                    <option value="">Select Institution</option>
                    {institutions.map((inst) => (
                        <option key={inst._id} value={inst._id}>
                            {inst.ime}
                        </option>
                    ))}
                </select>
                <select
                    name="uloga"
                    value={userCredentials.uloga}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                        <option key={role._id} value={role._id}>
                            {role.naziv}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
