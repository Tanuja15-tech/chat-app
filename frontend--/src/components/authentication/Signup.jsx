import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

const Signup = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [password, setPassword] = useState("");
    const [pic, setPic] = useState("");
    const [picLoading, setPicLoading] = useState(false);

    const submitHandler = async () => {
        setPicLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            alert("Please fill all fields");
            setPicLoading(false);
            return;
        }

        if (password !== confirmpassword) {
            alert("Passwords do not match");
            setPicLoading(false);
            return;
        }

        try {
            const config = {
                headers: { "Content-type": "application/json" },
            };
            const { data } = await axios.post(
                "/api/user",
                { name, email, password, pic },
                config
            );

            localStorage.setItem("userInfo", JSON.stringify(data));
            alert("Registration successful!");
            setPicLoading(false);
            navigate("/chats"); // ✅ Updated to useNavigate
        } catch (error) {
            alert(error.response?.data?.message || "Signup failed");
            setPicLoading(false);
        }
    };

    const postDetails = (pics) => {
        setPicLoading(true);
        if (!pics) {
            alert("Please select an image!");
            setPicLoading(false);
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "dcwuanrqr");

            fetch("https://api.cloudinary.com/v1_1/dcwuanrqr/image/upload", {
                method: "POST",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Cloudinary URL:", data.url); // Add this to check
                    setPic(data.url.toString());
                    setPicLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            alert("Please select a valid image (jpeg/png)");
            setPicLoading(false);
        }
    };

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                    <Form.Control
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="outline-secondary" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </div>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <div className="input-group">
                    <Form.Control
                        type={show ? "text" : "password"}
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <Button variant="outline-secondary" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </div>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Upload your Picture</Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </Form.Group>

            <Button
                variant="primary"
                className="w-100"
                onClick={submitHandler}
                disabled={picLoading}
            >
                {picLoading ? "Signing Up..." : "Sign Up"}
            </Button>
        </Form>
    );
};

export default Signup;
