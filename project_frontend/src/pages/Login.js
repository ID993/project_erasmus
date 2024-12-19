import React, { useState } from 'react';

const Login = () => {
    // Declare state for the form fields and error message
    const [email, setEmail] = useState('');
    const [sifra, setSifra] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email || !sifra) {
            setError('Email and password are required');
            return;
        }

        const user = { email, sifra };

        console.log('User object (email + password):', user);  // Log the request body to check

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',  // Ensure it's a POST request
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            // Check if response is okay (status 200-299)
            if (!response.ok) {
                const data = await response.json(); // Get the response body
                setError(data.message || 'Failed to login');
                return; // Stop further execution if the response is not OK
            }

            // If the response is okay, parse the data
            const data = await response.json();
            setSuccess(true);
            alert('Login successful');
            localStorage.setItem('token', data.token); // Store the token in localStorage

        } catch (err) {
            setError('Failed to connect to the server');
            console.error('Login Error:', err);
        }
    };

    return (
        <div>
            <h2>Login</h2>

            {/* Display success message */}
            {success && <div>Login successful!</div>}

            {/* Display error message */}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Handle email change
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={sifra}
                    onChange={(e) => setSifra(e.target.value)} // Handle password change
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};


export default Login;
