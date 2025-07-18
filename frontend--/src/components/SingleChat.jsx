import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import ScrollableChat from "./ScrollableChat";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import {
    getSender,
    getSenderFull
} from "../config/ChatLogics";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import "./styles.css"; // custom styles if needed

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const {
        selectedChat,
        setSelectedChat,
        user,
        notification,
        setNotification
    } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            setLoading(true);
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            alert("Failed to load the messages.");
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                alert("Failed to send the message.");
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;

        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    return (
        <>
            {selectedChat ? (
                <>
                    <div className="d-flex justify-content-between align-items-center px-2 pb-3">
                        <Button
                            variant="light"
                            className="d-md-none"
                            onClick={() => setSelectedChat("")}
                        >
                            ←
                        </Button>
                        <h5 className="m-0">
                            {!selectedChat.isGroupChat
                                ? getSender(user, selectedChat.users)
                                : selectedChat.chatName.toUpperCase()}
                        </h5>
                        {!selectedChat.isGroupChat ? (
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        ) : (
                            <UpdateGroupChatModal
                                fetchMessages={fetchMessages}
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                            />
                        )}
                    </div>

                    <div
                        className="bg-light rounded p-3 overflow-auto d-flex flex-column justify-content-end"
                        style={{ height: "100%", width: "100%" }}
                    >
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        {istyping && (
                            <div className="text-muted mb-2 ms-2">Typing...</div>
                        )}

                        <input
                            type="text"
                            className="form-control mt-3"
                            placeholder="Enter a message..."
                            value={newMessage}
                            onChange={typingHandler}
                            onKeyDown={sendMessage}
                        />
                    </div>
                </>
            ) : (
                <div className="d-flex justify-content-center align-items-center h-100">
                    <h3 className="text-center">Click on a user to start chatting</h3>
                </div>
            )}
        </>
    );
};

export default SingleChat;
