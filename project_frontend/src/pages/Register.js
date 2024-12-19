import React, { useState } from 'react';

const Register = () => {
    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [email, setEmail] = useState('');
    const [sifra, setSifra] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!ime || !prezime || !email || !sifra) {
            setError('All fields are required');
            return;
        }

        const user = { ime, prezime, email, sifra };

        console.log('User data to be sent:', user); // Log the user data for debugging

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (response.status === 201) {
                setSuccess(true);
                alert('User created successfully');
            } else {
                setError(data.message || 'Failed to register');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to connect to the server');
        }
    };


    return (
        <div>
            <h2>Register</h2>

            {/* Display success message */}
            {success && <div>Registration successful! Please login.</div>}

            {/* Display error message */}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Ime"
                    value={ime}
                    onChange={(e) => setIme(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Prezime"
                    value={prezime}
                    onChange={(e) => setPrezime(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Sifra"
                    value={sifra}
                    onChange={(e) => setSifra(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
