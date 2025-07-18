// src/pages/Chatpage.jsx
import React, { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import "bootstrap/dist/css/bootstrap.min.css";

const Chatpage = () => {
    const [fetchAgain, setFetchAgain] = useState(false);
    const { user } = ChatState();

    return (
        <div className="w-100">
            {user && <SideDrawer />}

            <div
                className="d-flex justify-content-between p-3"
                style={{ height: "91.5vh", width: "100%" }}
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && (
                    <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                )}
            </div>
        </div>
    );
};

export default Chatpage;
