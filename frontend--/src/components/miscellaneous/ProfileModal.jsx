import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ProfileModal = ({ user, children }) => {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <>
            {children ? (
                <span onClick={handleShow} style={{ cursor: "pointer" }}>
                    {children}
                </span>
            ) : (
                <Button variant="link" onClick={handleShow}>
                    <i className="bi bi-eye-fill"></i> {/* Bootstrap icon for "view" */}
                </Button>
            )}

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="w-100 text-center" style={{ fontSize: "32px", fontFamily: "Work Sans" }}>
                        {user.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex flex-column align-items-center justify-content-between">
                    <img
                        src={user.pic}
                        alt={user.name}
                        className="rounded-circle mb-3"
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                    <p style={{ fontSize: "24px", fontFamily: "Work Sans" }}>
                        Email: {user.email}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProfileModal;
