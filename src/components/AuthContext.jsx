"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Optionally, call an API endpoint that returns current user
        // Here we just assume if cookie exists and API doesn't fail, user is logged in
        setIsAuthenticated(true); // Simplified for now
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Login sets frontend state only; cookie is handled by login API
  const login = () => {
    setIsAuthenticated(true);
  };

  // Logout calls backend to clear cookie, then updates state
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
