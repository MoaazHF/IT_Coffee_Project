import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/auth-context";
export const Layout = ({ children }) => {
    const { session, logout } = useAuth();
    return (_jsxs("div", { className: "app-shell", children: [_jsx("header", { className: "site-header", children: _jsxs("div", { className: "container header-inner", children: [_jsx(Link, { className: "brand", to: "/", children: "Daily Grind" }), _jsxs("nav", { "aria-label": "Main navigation", className: "main-nav", children: [_jsx(NavLink, { to: "/", children: "Home" }), _jsx(NavLink, { to: "/shop", children: "Shop" }), _jsx(NavLink, { to: "/contact", children: "Contact" }), _jsx(NavLink, { to: "/cart", children: "Cart" }), session ? (_jsx("button", { className: "link-button", onClick: () => void logout(), children: "Logout" })) : (_jsxs(_Fragment, { children: [_jsx(NavLink, { to: "/login", children: "Login" }), _jsx(NavLink, { to: "/signup", children: "Sign Up" })] }))] })] }) }), _jsx("main", { className: "container content", id: "main-content", children: children }), _jsx("footer", { className: "site-footer", children: _jsxs("div", { className: "container", children: ["\u00A9 ", new Date().getFullYear(), " Daily Grind Coffee"] }) })] }));
};
