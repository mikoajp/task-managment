import { create } from 'zustand';
import { api } from '@/lib/api';
import type { User, LoginCredentials, RegisterCredentials } from '@/types/auth';

interface AuthResponse {
    user: User;
    token: string;
}

interface AuthStore {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
}
export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.auth.login<AuthResponse>(credentials);
            localStorage.setItem('token', response.token);
            set({ user: response.user, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    register: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.auth.register<AuthResponse>(credentials);
            localStorage.setItem('token', response.token);
            set({ user: response.user, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, error: null });
    },
}));