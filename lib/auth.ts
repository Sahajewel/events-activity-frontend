// import api from './api';
// import { AuthResponse, User } from '@/types';

// export const authApi = {
//   register: async (data: {
//     email: string;
//     password: string;
//     fullName: string;
//     location?: string;
//     bio?: string;
//     interests?: string[];
//   }): Promise<AuthResponse> => {
//     const response = await api.post('/auth/register', data);
//     return response.data.data;
//   },

//   login: async (email: string, password: string): Promise<AuthResponse> => {
//     const response = await api.post('/auth/login', { email, password });
//     return response.data.data;
//   },

//   logout: async (): Promise<void> => {
//     try {
//       await api.post('/auth/logout');
//     } catch (error) {
//       // Logout from client side even if API call fails
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     }
//   },

//   getMe: async (): Promise<User> => {
//     const response = await api.get('/auth/me');
//     return response.data.data;
//   },

//   refreshToken: async (): Promise<{ token: string }> => {
//     const response = await api.post('/auth/refresh');
//     return response.data.data;
//   },
// };
