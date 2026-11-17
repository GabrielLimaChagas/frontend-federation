import React, { createContext, useContext, useState, useEffect } from "react";
import { authStorage } from "./api";
import { bffService } from "./bffService";

interface AuthContextType {
  token: string | null;
  user: string | null;
  isAuthenticated: boolean;
  loginDemo: (username?: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  isAuthenticated: false,
  loginDemo: async () => "",
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(authStorage.getToken());
  const [user, setUser] = useState<string | null>(localStorage.getItem("crmaster_auth_user") || (token ? "admin" : null));

  const loginDemo = async (username = "admin") => {
    const issuedToken = await bffService.login(username, "password123");
    setToken(issuedToken);
    setUser(username);
    localStorage.setItem("crmaster_auth_user", username);
    return issuedToken;
  };

  const logout = () => {
    authStorage.removeToken();
    localStorage.removeItem("crmaster_auth_user");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const currentToken = authStorage.getToken();
    if (currentToken && !token) {
      setToken(currentToken);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loginDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
