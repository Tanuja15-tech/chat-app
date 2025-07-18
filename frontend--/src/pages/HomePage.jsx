import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ React Router v6
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";

function Homepage() {
    const navigate = useNavigate(); // ✅ useNavigate replaces useHistory

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) navigate("/chats"); // ✅ redirect
    }, [navigate]);

    return (
        <div className="container d-flex flex-column align-items-center justify-content-center mt-5">
            <div className="w-100 p-3 bg-white border rounded text-center mb-3">
                <h1 className="display-4">Talk-A-Tive</h1>
            </div>
            <div className="w-100 p-4 bg-white border rounded">
                <ul className="nav nav-tabs mb-3" id="authTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link active"
                            id="login-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#login"
                            type="button"
                            role="tab"
                        >
                            Login
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className="nav-link"
                            id="signup-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#signup"
                            type="button"
                            role="tab"
                        >
                            Sign Up
                        </button>
                    </li>
                </ul>
                <div className="tab-content" id="authTabsContent">
                    <div className="tab-pane fade show active" id="login" role="tabpanel">
                        <Login />
                    </div>
                    <div className="tab-pane fade" id="signup" role="tabpanel">
                        <Signup />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Homepage;
