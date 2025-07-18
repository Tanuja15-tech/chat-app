import React from "react";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();

    return (
        <div
            className={`bg-white rounded border p-3 ${selectedChat ? "d-flex" : "d-none"
                } flex-column w-100 w-md-68`}
            style={{ borderWidth: "1px" }}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
    );
};

export default Chatbox;
