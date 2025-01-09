import React, { useState, useEffect } from "react";

const Program = () => {
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/programs");
                const data = await response.json();
                setPrograms(data);
            } catch (error) {
                console.error("Error fetching programs:", error);
            }
        };

        fetchPrograms();
    }, []);

    return (
        <div>
            <h1>Erasmus Programi</h1>
            <ul>
                {programs.map(program => (
                    <li key={program.id}>{program.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Program;