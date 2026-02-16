interface AuthState {
    isAuthenticated: boolean;
    user: {
        id: string;
        email: string;
        role: string;
    } | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: AuthState['user']) => void;
}
export declare const useAuthStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AuthState>>;
export {};
