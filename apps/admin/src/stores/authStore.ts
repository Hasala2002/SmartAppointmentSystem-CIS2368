import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginRequest } from '../api/auth'

interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  user: { id: string; email: string; role: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: AuthState['user']) => void
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
      login: async (email: string, password: string) => {
        const response = await loginRequest(email, password)
        if (response.user.role !== 'staff') {
          set({ isAuthenticated: false, accessToken: null, refreshToken: null, user: null })
          throw new Error('Only staff users can access the admin portal.')
        }
        set({
          isAuthenticated: true,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          user: {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role,
          },
        })
      },
      logout: () => {
        set({ isAuthenticated: false, accessToken: null, refreshToken: null, user: null })
      },
      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },
    }),
    { name: 'admin-auth-store' }
  )
)
