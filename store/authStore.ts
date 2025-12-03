// import { create } from "zustand";
// import { User } from "@/types";

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   setUser: (user: User | null) => void;
//   setToken: (token: string | null) => void;
//   setLoading: (loading: boolean) => void;
//   logout: () => void;
//   initialize: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   token: null,
//   isLoading: true,

//   setUser: (user) => set({ user }),

//   setToken: (token) => set({ token }),

//   setLoading: (isLoading) => set({ isLoading }),

//   logout: () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     set({ user: null, token: null });
//   },

//   initialize: () => {
//     try {
//       const storedToken = localStorage.getItem("token");
//       const storedUser = localStorage.getItem("user");

//       if (storedToken && storedUser) {
//         set({
//           token: storedToken,
//           user: JSON.parse(storedUser),
//           isLoading: false,
//         });
//       } else {
//         set({ isLoading: false });
//       }
//     } catch (error) {
//       console.error("Failed to initialize auth:", error);
//       set({ isLoading: false });
//     }
//   },
// }));
