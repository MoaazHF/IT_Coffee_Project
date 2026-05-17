import { createContext, useContext, useMemo, useState } from "react";
import { logout as logoutRequest } from "../api/auth";
import type { AuthSession } from "../types/domain";

type AuthContextValue = {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
  logout: () => Promise<void>;
};

const STORAGE_KEY = "coffee_auth_session";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const loadSession = (): AuthSession | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSessionState] = useState<AuthSession | null>(loadSession);

  const setSession = (nextSession: AuthSession | null): void => {
    setSessionState(nextSession);
    if (nextSession) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const logout = async (): Promise<void> => {
    if (session?.refreshToken) {
      await logoutRequest(session.refreshToken).catch(() => undefined);
    }
    setSession(null);
  };

  const value = useMemo(() => ({ session, setSession, logout }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
