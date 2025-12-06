/* eslint-disable react-refresh/only-export-components */
import React, { useContext, useEffect, useState } from "react";
import * as api from "../services/api";
import AuthReactContext from "./AuthContextInit";

export interface AuthContextType {
  user: { id: number; email: string } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, password_confirmation: string) => Promise<void>;
  logout: () => void;
}

// Export component separately to satisfy react-refresh rule
const AuthProviderComponent = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [token, setTokenState] = useState<string | null>(api.getToken());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMe = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const resp = await api.me();
        setUser(resp.user);
      } catch (err) {
        console.error("Failed to load current user", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };
    void loadMe();
  }, [token]);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const resp = await api.login(email, password);
      api.setToken(resp.token);
      setTokenState(resp.token);
      setUser(resp.user);
    } catch (err) {
      console.error("Login failed", err);
      const apiError = err as { response?: { data?: { error?: string } } };
      setError(apiError.response?.data?.error || "Login failed");
      handleLogout();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, password_confirmation: string) => {
    setError(null);
    setLoading(true);
    try {
      const resp = await api.register(email, password, password_confirmation);
      api.setToken(resp.token);
      setTokenState(resp.token);
      setUser(resp.user);
    } catch (err) {
      console.error("Register failed", err);
      const apiError = err as { response?: { data?: { errors?: string[] } } };
      setError(apiError.response?.data?.errors?.join(", ") || "Register failed");
      handleLogout();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.clearToken();
    setTokenState(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return <AuthReactContext.Provider value={value}>{children}</AuthReactContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthReactContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export const AuthProvider = AuthProviderComponent;

