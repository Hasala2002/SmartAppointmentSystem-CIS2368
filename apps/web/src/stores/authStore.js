import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useAuthStore = create()(persist((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    login: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken, isAuthenticated: true }),
    setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
    logout: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
}), {
    name: 'auth-store',
}));
