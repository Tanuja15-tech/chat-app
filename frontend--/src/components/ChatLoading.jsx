import React from "react";

const ChatLoading = () => {
    return (
        <div className="d-flex flex-column gap-2">
            {[...Array(12)].map((_, index) => (
                <div className="placeholder-glow" key={index}>
                    <div className="placeholder col-12" style={{ height: "45px" }}></div>
                </div>
            ))}
        </div>
    );
};

export default ChatLoading;
