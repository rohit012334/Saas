import { create } from 'zustand';

const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

export const useAuthStore = create((set) => ({
  isAuthenticated: !!storedToken,
  token: storedToken,
  user: storedUser ? JSON.parse(storedUser) : null,
  login: (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    set({ isAuthenticated: true, user: userData, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null, token: null });
  },
}));
