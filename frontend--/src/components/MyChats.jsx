import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import "./styles.css"; // Include any custom styles here
import { Toast } from "bootstrap"; // Only needed if you're triggering Bootstrap toasts manually

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("/api/chat", config);
            setChats(data);
        } catch (error) {
            alert("Error: Failed to load chats.");
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line
    }, [fetchAgain]);

    return (
        <div
            className={`bg-white rounded border p-3 ${selectedChat ? "d-none d-md-flex" : "d-flex"
                } flex-column align-items-center w-100 w-md-31`}
        >
            {/* Header */}
            <div className="w-100 d-flex justify-content-between align-items-center px-3 pb-3">
                <h4 className="m-0" style={{ fontFamily: "Work Sans" }}>
                    My Chats
                </h4>
                <GroupChatModal>
                    <button className="btn btn-primary btn-sm d-flex align-items-center">
                        <span className="me-1">+</span> New Group Chat
                    </button>
                </GroupChatModal>
            </div>

            {/* Chat List */}
            <div
                className="w-100 p-3 rounded overflow-auto bg-light flex-grow-1"
                style={{ maxHeight: "100%", overflowY: "auto" }}
            >
                {chats ? (
                    <div className="d-flex flex-column gap-2">
                        {chats.map((chat) => (
                            <div
                                key={chat._id}
                                className={`rounded px-3 py-2 ${selectedChat === chat ? "bg-info text-white" : "bg-secondary-subtle text-dark"
                                    }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelectedChat(chat)}
                            >
                                <div>
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </div>
                                {chat.latestMessage && (
                                    <small>
                                        <strong>{chat.latestMessage.sender.name}:</strong>{" "}
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </small>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <ChatLoading />
                )}
            </div>
        </div>
    );
};

export default MyChats;
