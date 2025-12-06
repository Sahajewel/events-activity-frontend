/*eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// --- 1. Axios Interceptor to add Authorization Header ---
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // withCredentials is removed as we are no longer using cookies
});

// Add an interceptor to attach the Bearer token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Attach the token in the format the backend expects
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// --------------------------------------------------------

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profileImage?: string;
  location?: string;
  bio?: string;
}
export interface RegisterParams {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  location?: string;
  bio?: string;
}
export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    // Check for token before attempting to fetch user
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // The interceptor above will automatically add the token header
      const res = await api.get("/auth/me");
      setUser(res.data.data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      // Clear token if fetch fails (e.g., token expired/invalid)
      localStorage.removeItem("accessToken");
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

      // --- 2. Save Token from Response ---
      // The backend must send the token in the response body (res.data.data.token)
      localStorage.setItem("accessToken", res.data.data.token);
      // ------------------------------------

      setUser(res.data.data.user);
      setIsAuthenticated(true);
      router.push("/");
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const register = async (data: RegisterParams) => {
    try {
      const { fullName, email, password, confirmPassword, location, bio } =
        data;
      const res = await api.post("/auth/register", {
        fullName,
        email,
        password,
        confirmPassword,
        location,
        bio,
      });

      // --- 3. Save Token from Response ---
      // The backend must send the token in the response body
      localStorage.setItem("accessToken", res.data.data.token);
      // ------------------------------------

      setUser(res.data.data.user);
      setIsAuthenticated(true);
      router.push("/");
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");

      // --- 4. Clear Token from Local Storage ---
      localStorage.removeItem("accessToken");
      // -----------------------------------------

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
    fetchUser,
  };
};
