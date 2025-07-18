import React from "react";
import { X } from "react-bootstrap-icons"; // Bootstrap icon for Close (optional)
import "bootstrap/dist/css/bootstrap.min.css"; // Make sure Bootstrap CSS is loaded

const UserBadgeItem = ({ user, handleFunction, admin }) => {
    return (
        <span
            className="badge bg-primary text-white rounded-pill d-inline-flex align-items-center m-1 p-2"
            style={{ fontSize: "12px", cursor: "pointer" }}
            onClick={handleFunction}
        >
            {user.name}
            {admin === user._id && <span className="ms-1">(Admin)</span>}
            <X className="ms-2" style={{ fontSize: "10px" }} />
        </span>
    );
};

export default UserBadgeItem;
