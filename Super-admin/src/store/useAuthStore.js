import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEMO_EMAIL = 'admin@gmail.com'
const DEMO_PASSWORD = 'Admin@123'

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      admin: null,
      login: (email, password) => {
        const e = (email || '').trim().toLowerCase()
        const p = (password || '').trim()
        if (e === DEMO_EMAIL && p === DEMO_PASSWORD) {
          set({
            isLoggedIn: true,
            admin: { name: 'Super Admin', email: DEMO_EMAIL, role: 'Super Admin' },
          })
          return true
        }
        return false
      },
      logout: () => set({ isLoggedIn: false, admin: null }),
    }),
    { name: 'gms-auth' }
  )
)
