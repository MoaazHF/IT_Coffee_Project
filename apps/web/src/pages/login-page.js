import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../context/auth-context";
export const LoginPage = () => {
    const { setSession } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const onSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        try {
            const session = await login(email, password);
            setSession(session);
            navigate("/shop");
        }
        catch {
            setError("Invalid credentials or server unavailable.");
        }
    };
    return (_jsxs("section", { className: "panel auth-panel", children: [_jsx("h1", { children: "Login" }), _jsxs("form", { onSubmit: (event) => void onSubmit(event), children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) }), _jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", type: "password", required: true, minLength: 8, value: password, onChange: (e) => setPassword(e.target.value) }), _jsx("button", { className: "button", type: "submit", children: "Login" })] }), error ? _jsx("p", { className: "error-text", children: error }) : null, _jsxs("p", { children: ["No account yet? ", _jsx(Link, { to: "/signup", children: "Sign up" })] })] }));
};
