import api from "./api";
import { tokenService } from "./tokenService";

import { UserRole } from '../types/user';

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  rating?: number;
}

interface RegisterCredentials {
  email: string;
  name: string;
  password: string;
  role?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

api.defaults.withCredentials = true;

export const authApi = {
  login: async ({ email, password }: LoginCredentials) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token } = response.data;
    tokenService.setAccessToken(access_token);
    return response.data;
  },
  register: async (credentials: RegisterCredentials) => {
    const response = await api.post('/auth/register', credentials);
    if (response.data.access_token) {
      tokenService.setAccessToken(response.data.access_token);
    }
    return response.data;
  },
  logout: async () => {
    try {
     
      const response = await api.post('/auth/logout', {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
    
      tokenService.clearTokens();
      
      return response.data;
    } catch (error) {
      console.error('Error during logout:', error);
      tokenService.clearTokens();
      return { success: true, message: 'Logged out locally' };
    }
  },
  getUserInfo: async () => {
    try {
      const response = await api.post('/auth/me', {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }
};
  