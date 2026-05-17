import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from "react";
export class ErrorBoundary extends Component {
    state = { hasError: false };
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(_error, _errorInfo) { }
    render() {
        if (this.state.hasError) {
            return (_jsxs("section", { className: "panel", children: [_jsx("h2", { children: "Unexpected error" }), _jsx("p", { children: "The application hit a runtime error. Refresh and retry." })] }));
        }
        return this.props.children;
    }
}
