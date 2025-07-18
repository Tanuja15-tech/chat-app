import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

function SideDrawer() {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const navigate = useNavigate();
    const { user, setSelectedChat, chats, setChats } = ChatState();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const handleSearch = async () => {
        if (!search) {
            alert("Please Enter something in search");
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            alert("Failed to Load the Search Results");
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
        } catch (error) {
            alert("Error fetching the chat");
        }
    };

    return (
        <div className="container-fluid p-3 border bg-white">
            <div className="d-flex justify-content-between align-items-center">
                <button className="btn btn-outline-secondary" onClick={handleSearch}>
                    <i className="fas fa-search"></i> Search User
                </button>
                <h4>Echo-chat</h4>
                <div className="dropdown">
                    <button
                        className="btn btn-light dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <img
                            src={user.pic}
                            alt={user.name}
                            className="rounded-circle"
                            width="30"
                            height="30"
                        />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li><button className="dropdown-item">My Profile</button></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item" onClick={logoutHandler}>Logout</button></li>
                    </ul>
                </div>
            </div>

            <div className="mt-3">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or email"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleSearch}>Go</button>
                </div>
                <div className="mt-2">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        searchResult?.map((user) => (
                            <div
                                key={user._id}
                                className="list-group-item list-group-item-action"
                                onClick={() => accessChat(user._id)}
                            >
                                {user.name}
                            </div>
                        ))
                    )}
                    {loadingChat && <div className="spinner-border text-primary mt-2" role="status"></div>}
                </div>
            </div>
        </div>
    );
}

export default SideDrawer;
