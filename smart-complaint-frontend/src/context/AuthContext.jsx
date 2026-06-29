import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("smart_city_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("smart_city_token") && !user) {
      authService.profile().then(setSession).catch(logout);
    }
  }, []);

  const setSession = (authUser, token) => {
    const nextUser = authUser.user ? authUser.user : authUser;
    const nextToken = token || authUser.token;
    if (nextToken) localStorage.setItem("smart_city_token", nextToken);
    localStorage.setItem("smart_city_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const auth = await authService.login(payload);
      setSession(auth);
      return auth.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
    await authService.register(payload);
      
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("smart_city_token");
    localStorage.removeItem("smart_city_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user) }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
