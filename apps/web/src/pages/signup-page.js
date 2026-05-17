import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { useAuth } from "../context/auth-context";
export const SignupPage = () => {
    const { setSession } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const onSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        try {
            const session = await register(name, email, password);
            setSession(session);
            navigate("/shop");
        }
        catch {
            setError("Unable to register with current input.");
        }
    };
    return (_jsxs("section", { className: "panel auth-panel", children: [_jsx("h1", { children: "Sign Up" }), _jsxs("form", { onSubmit: (event) => void onSubmit(event), children: [_jsx("label", { htmlFor: "name", children: "Name" }), _jsx("input", { id: "name", type: "text", required: true, minLength: 2, value: name, onChange: (e) => setName(e.target.value) }), _jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) }), _jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", type: "password", required: true, minLength: 8, value: password, onChange: (e) => setPassword(e.target.value) }), _jsx("button", { className: "button", type: "submit", children: "Create account" })] }), error ? _jsx("p", { className: "error-text", children: error }) : null, _jsxs("p", { children: ["Already registered? ", _jsx(Link, { to: "/login", children: "Login" })] })] }));
};
