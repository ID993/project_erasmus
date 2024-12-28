import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = parseJwt(token).uloga;
  const loggedUserId = parseJwt(token).korisnik_id;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = async () => {
    if (searchUser.length < 3) {
      setError("Search query must be at least 3 characters.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/search?query=${searchUser}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError("No users found matching your search query.");
        } else {
          setError("Failed to search users.");
        }
        return;
      }

      const data = await response.json();
      setUsers(data);
      setError(""); // Clear any existing errors on successful search
    } catch (err) {
      console.error(err);
      setError("An error occurred while searching for users.");
    }
  };

  const handleDelete = async (id) => {
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

      setUsers(users.filter((user) => user._id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDetails = (id) => {
    navigate(`/user-profile/${id}`);
  };

  return (
    <div>
      <h2>Users List</h2>
      <div>
        <input
          type="text"
          placeholder="Search"
          value={searchUser}
          onChange={(e) => {
            setSearchUser(e.target.value);
            setError(""); // Clear error when user starts typing
          }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.ime}</td>
              <td>{user.prezime}</td>
              <td>{user.email}</td>
              <td>{user.uloga[0].naziv}</td>
              <td>
                <button onClick={() => handleDetails(user._id)}>Details</button>
                {userRole === "admin" && user._id !== loggedUserId && (
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && !error && <p>No users available to display.</p>}
    </div>
  );
};

export default UserList;
