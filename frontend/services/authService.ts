import { fetchApi, setAuthToken, removeAuthToken } from './api';
import { User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetchApi<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.data) {
      setAuthToken(res.data.token);
      localStorage.setItem('hostel_user', JSON.stringify(res.data.user));
    }

    return res.data!;
  },

  async getMe(): Promise<User> {
    const res = await fetchApi<User>('/auth/me');
    return res.data!;
  },

  logout(): void {
    removeAuthToken();
    try {
      fetchApi('/auth/logout', { method: 'POST' }).catch(() => {});
    } catch {}
  },

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('hostel_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};
