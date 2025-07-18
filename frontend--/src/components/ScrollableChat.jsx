import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import "./styles.css"; // Optional, for custom styling

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div className="d-flex" key={m._id}>
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <div
                                    className="me-2 mt-1"
                                    title={m.sender.name}
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                >
                                    <img
                                        src={m.sender.pic}
                                        alt={m.sender.name}
                                        className="rounded-circle"
                                        style={{ width: "30px", height: "30px", cursor: "pointer" }}
                                    />
                                </div>
                            )}
                        <span
                            className={`px-3 py-2 rounded-pill mb-1`}
                            style={{
                                backgroundColor:
                                    m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0",
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                maxWidth: "75%",
                                display: "inline-block",
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    );
};

export default ScrollableChat;
