// src/hooks/useAuth.ts

/*eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// আপনার বেস URL অপরিবর্তিত
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// =======================================================
// ⭐ Axios Interceptors (Token Refresh Logic)
// =======================================================

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. রিকোয়েস্ট ইন্টারসেপ্টর: প্রতি কলে accessToken যুক্ত করা
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

// 2. ⭐ Response Interceptor: টোকেন রিফ্রেশ এবং রিকোয়েস্ট কিউয়িং লজিক
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // 401 error এবং আমরা পূর্বে রিফ্রেশ করার চেষ্টা করিনি
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // যদি অন্য কোনো রিকোয়েস্ট রিফ্রেশ করছে, তবে এই রিকোয়েস্টটিকে অপেক্ষমাণ তালিকায় রাখো
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // অপেক্ষার পর, নতুন টোকেন দিয়ে হেডারে সেট করে রিকোয়েস্টটি আবার চালাও
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // refreshToken না থাকলে লগআউট করে দাও
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // নতুন API কল: refreshToken পাঠিয়ে নতুন accessToken আনা
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken }
        );
        const data = res.data.data || res.data;

        localStorage.setItem("accessToken", data.accessToken);
        // যদি refreshToken পরিবর্তিত হয়, তবে নিচের লাইনটি ব্যবহার করুন:
        // localStorage.setItem("refreshToken", data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        processQueue(null, data.accessToken); // অপেক্ষমাণ রিকোয়েস্টগুলো নতুন টোকেন দিয়ে আবার চালাও
        return axios(originalRequest); // মূল রিকোয়েস্টটি আবার চালাও
      } catch (refreshError: any) {
        // রিফ্রেশ টোকেনও কাজ না করলে লগআউট করো
        processQueue(refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// =======================================================
// ⭐ useAuth Hook
// =======================================================

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
      // এখানে Interceptor স্বয়ংক্রিয়ভাবে টোকেন যুক্ত করবে
      const res = await api.get("/auth/me");
      setUser(res.data.data || res.data);
      setIsAuthenticated(true);
    } catch (err) {
      // টোকেন অবৈধ হলে বা এরর হলে লগআউট
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

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setUser(data.user);
        setIsAuthenticated(true);
        router.push("/");
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
    // client-side navigation ব্যবহার করে লগইন পেজে পাঠান
    router.push("/login");
  };

  return { user, isAuthenticated, loading, login, register, logout, fetchUser };
};
