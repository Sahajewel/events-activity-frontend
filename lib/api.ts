// /* eslint-disable @typescript-eslint/no-explicit-any */
// import axios, { AxiosError } from "axios";
// import { toast } from "sonner";

// // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// export const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError<any>) => {
//     const message = error.response?.data?.message || "Something went wrong";

//     // Handle 401 Unauthorized
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");

//       // Only redirect and show toast if not already on login page
//       if (
//         typeof window !== "undefined" &&
//         !window.location.pathname.includes("/login")
//       ) {
//         window.location.href = "/login";
//         toast.error("Session expired. Please login again.");
//       }
//     }
//     // Handle 403 Forbidden
//     else if (error.response?.status === 403) {
//       toast.error("You do not have permission to perform this action");
//     }
//     // Handle 404 Not Found
//     else if (error.response?.status === 404) {
//       toast.error("Resource not found");
//     }
//     // Handle 500 Internal Server Error
//     else if (error.response?.status === 500) {
//       toast.error("Server error. Please try again later.");
//     }
//     // Handle other errors
//     else if (error.response?.status !== 401) {
//       toast.error(message);
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
