import { create } from 'zustand';
import api from '@/lib/axios';

export const useTenantStore = create((set) => ({
  settings: {
    garageName: '',
    ownerName: '',
    garageEmail: '',
    garageAddress: '',
    garageLogoUrl: ''
  },
  fetching: false,
  fetchSettings: async () => {
    set({ fetching: true });
    try {
      const response = await api.get('/tenant-settings/platform');
      if (response.data.success) {
        set({ settings: response.data.data });
      }
    } catch (err) {
      console.error('Failed to fetch tenant settings:', err);
    } finally {
      set({ fetching: false });
    }
  },
  updateSettings: (newSettings) => {
    set((state) => ({ settings: { ...state.settings, ...newSettings } }));
  }
}));
