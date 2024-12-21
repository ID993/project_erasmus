import React, { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
    const [userCredentials, setUserCredentials] = useState({
        email: "",
        sifra: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!userCredentials.email || !userCredentials.sifra) {
            setError("Email and password are required");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userCredentials),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "Failed to login");
                return;
            }

            const data = await response.json();
            setSuccess(true);
            localStorage.setItem("token", data.token);

            // Update isLoggedIn state and navigate to dashboard
            setIsLoggedIn(true);
            alert("Login successful");
            navigate("/dashboard");
        } catch (err) {
            setError("Failed to connect to the server");
            console.error("Login Error:", err);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col items-center space-y-6 py-10 px-4 bg-gray-50">
            <h2 className="text-2xl font-bold">Login</h2>
            {success && <div>Login successful!</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            <form onSubmit={handleLogin} className="flex flex-col space-y-4 w-full max-w-md">
                <input
                    type="email"
                    name="email"
                    value={userCredentials.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="sifra"
                        value={userCredentials.sifra}
                        onChange={handleChange}
                        placeholder="Password"
                        className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
                        {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
