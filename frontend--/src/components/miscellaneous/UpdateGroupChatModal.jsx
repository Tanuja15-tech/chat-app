import React, { useState } from "react";
import { Modal, Button, Form, Spinner, Badge, InputGroup, FormControl as BsFormControl } from "react-bootstrap";
import { EyeFill } from "react-bootstrap-icons";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setSearchResult(data);
            setLoading(false);
        } catch (error) {
            alert("Failed to load search results");
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                "/api/chat/rename",
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            alert("Error renaming group");
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            alert("User already in group");
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            alert("Only admins can add someone");
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                "/api/chat/groupadd",
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            alert("Error adding user");
            setLoading(false);
        }
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            alert("Only admins can remove someone");
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                "/api/chat/groupremove",
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            alert("Error removing user");
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="outline-primary" onClick={handleShow}>
                <EyeFill />
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedChat.chatName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        {selectedChat.users.map((u) => (
                            <UserBadgeItem
                                key={u._id}
                                user={u}
                                admin={selectedChat.groupAdmin}
                                handleFunction={() => handleRemove(u)}
                            />
                        ))}
                    </div>
                    <InputGroup className="mb-3">
                        <BsFormControl
                            placeholder="Chat Name"
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                        <Button variant="success" onClick={handleRename} disabled={renameloading}>
                            {renameloading ? "Updating..." : "Update"}
                        </Button>
                    </InputGroup>
                    <Form.Group className="mb-3">
                        <BsFormControl
                            placeholder="Add user to group"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Form.Group>
                    {loading ? (
                        <Spinner animation="border" />
                    ) : (
                        searchResult?.map((user) => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                            />
                        ))
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleRemove(user)}>
                        Leave Group
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UpdateGroupChatModal;
