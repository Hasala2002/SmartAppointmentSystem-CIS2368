import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  user: { id: string; email: string; role: string } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: AuthState['user']) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {
    // Placeholder for future auth logic
    console.log('Login attempted:', email, password)
    set({ isAuthenticated: true, user: { id: '1', email, role: 'admin' } })
  },
  logout: () => {
    set({ isAuthenticated: false, user: null })
  },
  setUser: (user) => {
    set({ user, isAuthenticated: !!user })
  }
}))
