import { create } from 'zustand';

export const useRoleStore = create((set) => ({
  role: 'Tenant Admin', // Default role
  setRole: (role) => set({ role }),
}));
