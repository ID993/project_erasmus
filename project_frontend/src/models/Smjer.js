import React, { useState, useEffect } from "react";

const Smjer = () => {
    const [fields, setFields] = useState([]);

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/fields");
                const data = await response.json();
                setFields(data);
            } catch (error) {
                console.error("Error fetching fields:", error);
            }
        };

        fetchFields();
    }, []);

    return (
        <div>
            <h1>Smjerovi</h1>
            <ul>
                {fields.map(field => (
                    <li key={field.id}>{field.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Smjer;