import React, { useEffect, useState } from "react";

const getUserRole = (token) => {
    if (!token) return null;

    try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        return decodedToken.uloga;
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
};

const formatDate = (isoDate) => {
    if (!isoDate) return "Unknown";
    const date = new Date(isoDate);

    const time = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const day = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return `${time}, ${day}`;
};

const triggerEvaluation = async (applications) => {
    console.log("Triggering evaluation for all applications.");
    const institutionIds = [...new Set(applications.map((app) => app.ustanova?._id))].filter(
        (id) => id
    );

    if (!institutionIds.length) {
        alert("No valid institutions found for evaluation.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/applications/evaluate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ institutionIds, role: "all" }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            console.error("Backend Error:", data.message);
            alert(data.message || "Failed to evaluate applications.");
        }
    } catch (error) {
        console.error("Error occurred during evaluation:", error);
        alert("Error occurred during evaluation.");
    }
};

const AllApplications = () => {
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState("all");
    const [isEvaluating, setIsEvaluating] = useState(false);

    const token = localStorage.getItem("token");
    const userRole = getUserRole(token);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/applications/get-all", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (response.ok && data.success) {
                    setApplications(data.data || []);
                } else {
                    console.error("Error fetching applications:", data.message);
                }
            } catch (err) {
                console.error("Error fetching applications:", err);
            }
        };

        fetchApplications();
    }, [token]);

    const handleFilterChange = (type) => {
        setFilter(type);
    };

    const handleEvaluation = async () => {
        setIsEvaluating(true);
        await triggerEvaluation(applications);
        setIsEvaluating(false);
    };

    const filteredApplications = applications.filter((application) => {
        if (filter === "students") {
            return application.user?.uloga.some((role) => role.naziv === "student");
        }
        if (filter === "professors") {
            return application.user?.uloga.some((role) => role.naziv === "profesor");
        }
        return true;
    });

    return (
        <div>
            <h1>Applications</h1>
            {userRole === "admin" && (
                <div>
                    <button
                        className={filter === "all" ? "active" : ""}
                        onClick={() => handleFilterChange("all")}
                    >
                        All Applications
                    </button>
                    <button
                        className={filter === "students" ? "active" : ""}
                        onClick={() => handleFilterChange("students")}
                    >
                        Student Applications
                    </button>
                    <button
                        className={filter === "professors" ? "active" : ""}
                        onClick={() => handleFilterChange("professors")}
                    >
                        Professor Applications
                    </button>
                </div>
            )}
            {userRole === "admin" && (
                <button style={{ margin: "20px 0" }} onClick={handleEvaluation} disabled={isEvaluating}>
                    {isEvaluating ? "Evaluating..." : "Evaluate All Applications"}
                </button>
            )}
            {filteredApplications.length === 0 ? (
                <p>
                    {filter === "students"
                        ? "No student applications found."
                        : filter === "professors"
                            ? "No professor applications found."
                            : "No applications available."}
                </p>
            ) : (
                <table border="1" style={{ marginTop: "20px" }}>
                    <thead>
                        <tr>
                            <th>Institution</th>
                            <th>Accepted Students</th>
                            <th>Accepted Professors</th>
                            <th>Quota Students</th>
                            <th>Quota Professors</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplications.map((application) => (
                            <tr key={application._id}>
                                <td>{application.ustanova?.ime || "No Institution"}</td>
                                <td>{application.ustanova?.applicationsAcceptedStudents || 0}</td>
                                <td>{application.ustanova?.applicationsAcceptedProfessors || 0}</td>
                                <td>{application.ustanova?.quotaStudents || "Unknown"}</td>
                                <td>{application.ustanova?.quotaProfessors || "Unknown"}</td>
                                <td>{application.user?.ime || "Unknown"}</td>
                                <td>{application.user?.prezime || "Unknown"}</td>
                                <td>{application.user?.email || "Unknown"}</td>
                                <td>
                                    {application.user?.uloga
                                        ?.map((role) => role.naziv)
                                        .join(", ") || "Unknown"}
                                </td>
                                <td>{application.status || "Unknown"}</td>
                                <td>{formatDate(application.createdAt) || "Unknown"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AllApplications;
