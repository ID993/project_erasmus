import React, { useState, useEffect } from "react";

const Ustanova = () => {
    const [institutions, setInstitutions] = useState([]);

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/institutions");
                const data = await response.json();
                setInstitutions(data);
            } catch (error) {
                console.error("Error fetching institutions:", error);
            }
        };

        fetchInstitutions();
    }, []);

    return (
        <div>
            <h1>Ustanove</h1>
            <ul>
                {institutions.map(inst => (
                    <li key={inst.id}>{inst.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Ustanova;