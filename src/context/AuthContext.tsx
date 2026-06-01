import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchAuthUser, loginAdmin } from "@/services/api";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AuthContextValue = {
  token: string | null;
  user: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "kp_admin_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    const result = await loginAdmin(credentials);
    setToken(result.data.token);
    setUser(result.data.user);
    localStorage.setItem(STORAGE_KEY, result.data.token);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetchAuthUser(token);
        if (!active) {
          return;
        }
        setUser(response.data);
      } catch (_error) {
        if (!active) {
          return;
        }
        logout();
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [token, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [token, user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
