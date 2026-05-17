import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, useState } from "react";
import { logout as logoutRequest } from "../api/auth";
const STORAGE_KEY = "coffee_auth_session";
const AuthContext = createContext(undefined);
const loadSession = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
        return null;
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
};
export const AuthProvider = ({ children }) => {
    const [session, setSessionState] = useState(loadSession);
    const setSession = (nextSession) => {
        setSessionState(nextSession);
        if (nextSession) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
        }
        else {
            localStorage.removeItem(STORAGE_KEY);
        }
    };
    const logout = async () => {
        if (session?.refreshToken) {
            await logoutRequest(session.refreshToken).catch(() => undefined);
        }
        setSession(null);
    };
    const value = useMemo(() => ({ session, setSession, logout }), [session]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
};
