/*eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// রিকোয়েস্ট ইন্টারসেপ্টর
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ইউজার প্রোফাইল ফেচ করার লজিক
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/auth/me");
      setUser(res.data.data || res.data);
      setIsAuthenticated(true);
    } catch (err) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // লগইন লজিক
  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data.data || res.data;

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setUser(data.user);
        setIsAuthenticated(true);
        router.push("/");
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  // রেজিস্ট্রেশন লজিক
  const register = async (userData: any) => {
    try {
      const res = await api.post("/auth/register", userData);
      const data = res.data.data || res.data;

      // রেজিস্ট্রেশন সফল হলে টোকেনগুলো সেট করা
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setUser(data.user);
        setIsAuthenticated(true);
        router.push("/"); // অথবা ড্যাশবোর্ডে পাঠাতে পারো
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  // লগআউট লজিক
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return { user, isAuthenticated, loading, login, register, logout };
};
