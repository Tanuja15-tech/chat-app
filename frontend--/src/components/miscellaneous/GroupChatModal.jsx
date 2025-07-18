// GroupChatModal.jsx
import React, { useState } from "react";
import {
    Modal,
    Button,
    Form,
    Spinner,
    Badge,
    InputGroup,
} from "react-bootstrap";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

    const handleGroup = (userToAdd) => {
        if (selectedUsers.find((u) => u._id === userToAdd._id)) {
            alert("User already added");
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;

        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setSearchResult(data);
            setLoading(false);
        } catch (error) {
            alert("Error loading search results");
            setLoading(false);
        }
    };

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter((u) => u._id !== userToDelete._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || selectedUsers.length === 0) {
            alert("Please fill all the fields");
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.post(
                `/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );

            setChats([data, ...chats]);
            handleClose();
            alert("Group Chat Created!");
        } catch (error) {
            alert("Failed to create group chat");
        }
    };

    return (
        <>
            <span onClick={handleShow} style={{ cursor: "pointer" }}>
                {children}
            </span>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Group Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Chat Name"
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Add Users (e.g. John, Jane)"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Form.Group>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                        {selectedUsers.map((user) => (
                            <UserBadgeItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleDelete(user)}
                            />
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        searchResult
                            ?.slice(0, 4)
                            .map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)}
                                />
                            ))
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Create Chat
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default GroupChatModal;
