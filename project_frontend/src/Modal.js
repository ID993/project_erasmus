import React from "react";

const Modal = ({
  showModal,
  handleClose,
  deleteAction,
  entityId,
  entityName,
}) => {
  return (
    <div
      className={`modal ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()} // Prevent closing on dialog click
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Deletion</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to delete this {entityName}? This action
              cannot be undone.
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => deleteAction()} // This calls the passed function
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
