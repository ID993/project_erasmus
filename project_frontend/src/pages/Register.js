import React, { useState } from "react";

const Register = () => {
    const [userCredentials, setUserCredentials] = useState({
        ime: "",
        prezime: "",
        email: "",
        sifra: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!userCredentials.ime || !userCredentials.prezime || !userCredentials.email || !userCredentials.sifra) {
            setError("All fields are required");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
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
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="prezime"
                    value={userCredentials.prezime}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="email"
                    name="email"
                    value={userCredentials.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    name="sifra"
                    value={userCredentials.sifra}
                    onChange={handleChange}
                    placeholder="Password"
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
