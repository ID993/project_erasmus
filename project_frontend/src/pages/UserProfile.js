import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userIdFromToken = parseJwt(token).korisnik_id;

        setIsCurrentUser(userIdFromToken === id);

        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [id]);

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      alert("User updated successfully!");
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      alert("User deleted successfully!");
      navigate("/all-users");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>{isCurrentUser ? "Your Profile" : "User Details"}</h2>
      {editing ? (
        <div>
          <label>Name</label>
          <input
            type="text"
            value={user.ime || ""}
            onChange={(e) => setUser({ ...user, ime: e.target.value })}
          />
          <label>Last Name</label>
          <input
            type="text"
            value={user.prezime || ""}
            onChange={(e) => setUser({ ...user, prezime: e.target.value })}
          />
          <label>Email</label>
          <input
            type="email"
            value={user.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Name: {user.ime}</p>
          <p>Last Name: {user.prezime}</p>
          <p>Email: {user.email}</p>
          {isCurrentUser ? (
            <button onClick={() => setEditing(true)}>Edit</button>
          ) : (
            <>
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
