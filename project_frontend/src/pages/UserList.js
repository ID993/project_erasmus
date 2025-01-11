import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const userData = parseJwt(token);
  const userRole = userData?.uloga;
  const loggedUserId = userData?.korisnik_id;

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, [token]); // Only re-create `fetchUsers` if `token` changes

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (e) => {
    setSearchUserQuery(e.target.value);
    setError("");
  };

  const filterUsers = () => {
    if (searchUserQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowercasedQuery = searchUserQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.ime.toLowerCase().includes(lowercasedQuery) ||
          user.prezime.toLowerCase().includes(lowercasedQuery) ||
          user.email?.toLowerCase().includes(lowercasedQuery) ||
          user.uloga[0]?.naziv.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    filterUsers();
  }, [searchUserQuery, users]);

  const handleClose = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  const handleShowModal = (userId) => {
    setUserToDelete(userId);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    //if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((user) => user._id !== id));
      setShowModal(false);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleDetails = (id) => {
    navigate(`/user-profile/${id}`);
  };

  const handleAddAdminUser = () => {
    navigate("/add-admin");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Users List</h2>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search users..."
          value={searchUserQuery}
          onChange={handleSearchChange}
        />
        {userRole === "admin" && (
          <button className="btn btn-success" onClick={handleAddAdminUser}>
            Add Admin User
          </button>
        )}
      </div>
      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.ime}</td>
                <td>{user.prezime}</td>
                <td>{user.email}</td>
                <td>{user.uloga[0]?.naziv || "Unknown"}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleDetails(user._id)}
                    >
                      Details
                    </button>
                    {userRole === "admin" && user._id !== loggedUserId && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={handleShowModal}
                      >
                        Delete
                      </button>
                    )}
                    <Modal
                      showModal={showModal}
                      handleClose={handleClose}
                      deleteAction={() => handleDelete(user._id)} // Pass the function reference
                      entityId={userToDelete}
                      entityName="user"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Users Message */}
      {users.length === 0 && !error && (
        <div className="alert alert-info" role="alert">
          No users available to display.
        </div>
      )}
    </div>
  );
};

export default UserList;
