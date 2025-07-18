import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser } = ChatState();

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            alert("Please fill all fields");
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: { "Content-type": "application/json" },
            };

            const { data } = await axios.post(
                "/api/user/login",
                { email, password },
                config
            );

            alert("Login successful!");
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats"); // ✅ Correct v6 navigation
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
            setLoading(false);
        }
    };

    return (
        <Form>
            <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                    <Form.Control
                        type={show ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="outline-secondary" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </div>
            </Form.Group>

            <Button
                variant="primary"
                onClick={submitHandler}
                disabled={loading}
                className="w-100"
            >
                {loading ? "Logging in..." : "Login"}
            </Button>

            <Button
                variant="danger"
                className="w-100 mt-2"
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
            >
                Get Guest User Credentials
            </Button>
        </Form>
    );
};

export default Login;
