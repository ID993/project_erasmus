import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../Modal";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState(null);
  const [entityName, setEntityName] = useState("");
  const token = localStorage.getItem("token");
  const userData = parseJwt(token);
  const userRole = userData?.uloga;
  const userIdFromToken = userData?.korisnik_id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
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
        console.log(data);
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [id, userIdFromToken]);

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

      // alert("User updated successfully!");
      setEditing(false);
      navigate(`/user-profile/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShowModal = (entityId, name) => {
    setDeleteEntityId(entityId);
    setEntityName(name);
    setShowModal(true); // Show the modal
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

      setShowModal(false);
      navigate("/all-users");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <div className="container p-5 bg-light rounded shadow text-center">
        <h2 className="mb-4">
          {isCurrentUser ? "Your Profile" : "User Details"}
        </h2>
        {editing ? (
          <div className="mx-auto" style={{ maxWidth: "400px" }}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={user.ime || ""}
                onChange={(e) => setUser({ ...user, ime: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                value={user.prezime || ""}
                onChange={(e) => setUser({ ...user, prezime: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-success" onClick={handleUpdate}>
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>
              <strong>Name:</strong> {user.ime}
            </p>
            <p>
              <strong>Last Name:</strong> {user.prezime}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.uloga?.[0].naziv || "No role"}
            </p>
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button
                className="btn btn-primary"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              {!isCurrentUser && userRole === "admin" && (
                <button
                  className="btn btn-danger"
                  onClick={() => handleShowModal(user._id, "user")}
                >
                  Delete
                </button>
              )}
              <Modal
                showModal={showModal}
                handleClose={handleClose}
                deleteAction={handleDelete}
                entityId={deleteEntityId}
                entityName={entityName}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
