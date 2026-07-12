import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser as apiLogout, getMe } from '../services/authAPI';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getMe();
        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        // Suppress 401 errors on initial load
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    if (data.success) {
      setUser(data.data);
    }
    return data;
  };

  const register = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    if (data.success) {
      setUser(data.data);
    }
    return data;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
