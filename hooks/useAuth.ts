/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // needed if your backend uses cookies
});

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profileImage?: string;
}

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth/me"); // backend endpoint to get logged-in user
      setUser(res.data.data); // adjust if your API response structure is different
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data.data.user);
      setIsAuthenticated(true);
      router.push("/"); // redirect after login
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await api.post("/auth/register", {
        fullName,
        email,
        password,
      });
      setUser(res.data.data.user);
      setIsAuthenticated(true);
      router.push("/"); // redirect after registration
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setIsAuthenticated(false);
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    fetchUser, // in case you want to manually refresh user info
  };
};
