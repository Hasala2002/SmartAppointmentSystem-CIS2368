import { useAuthStore, AuthState } from '../stores/authStore'

export const useAuth = (): AuthState => useAuthStore()
