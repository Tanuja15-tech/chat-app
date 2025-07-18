import React from "react";
import { Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ handleFunction }) => {
    const { user } = ChatState();

    return (
        <div
            className="d-flex align-items-center w-100 px-3 py-2 mb-2 rounded"
            onClick={handleFunction}
            style={{
                backgroundColor: "#E8E8E8",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#38B2AC";
                e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#E8E8E8";
                e.currentTarget.style.color = "black";
            }}
        >
            <Image
                src={user.pic}
                alt={user.name}
                roundedCircle
                width="30"
                height="30"
                className="me-2"
            />
            <div>
                <div>{user.name}</div>
                <div style={{ fontSize: "12px" }}>
                    <strong>Email :</strong> {user.email}
                </div>
            </div>
        </div>
    );
};

export default UserListItem;
