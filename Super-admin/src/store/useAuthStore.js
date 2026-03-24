import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
const DEMO_EMAIL = 'admin@gmail.com'
const DEMO_PASSWORD = 'Admin@123'

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      admin: null,
      token: null,
      login: async (email, password) => {
        // Now calling real API (which will work for admin@gmail.com after seed)
        try {
          const res = await fetch(`${API_URL}/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          const data = await res.json()
          
          if (data.success) {
            set({
              isLoggedIn: true,
              token: data.token,
              admin: data.user, // Includes name, email, role, permissions
            })
            return true
          }
          return false
        } catch (err) {
          console.error('Login failed:', err)
          return false
        }
      },
      logout: () => set({ isLoggedIn: false, admin: null, token: null }),
    }),
    { name: 'gms-super-auth' }
  )
)


