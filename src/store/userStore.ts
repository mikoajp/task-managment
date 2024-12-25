import { create } from 'zustand';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
}

interface UserStore {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    updateUserInfo: (firstName: string, lastName: string) => Promise<void>;
    updateUserAvatar: (avatar: File) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    isLoading: false,
    error: null,

    fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch('https://recruitment-task.jakubcloud.pl/users/me', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            set({ user: data, error: null });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data';
            console.error(errorMessage);
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    updateUserInfo: async (firstName: string, lastName: string) => {
        set({ isLoading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch('https://recruitment-task.jakubcloud.pl/users/update', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user info');
            }

            const updatedUser = await response.json();
            set((state) => ({
                user: {
                    ...state.user,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                } as User,
                error: null,
            }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update user info';
            console.error(errorMessage);
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    updateUserAvatar: async (avatar: File) => {
        set({ isLoading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const formData = new FormData();
            formData.append('avatar', avatar);

            const response = await fetch('https://recruitment-task.jakubcloud.pl/users/avatar', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update avatar');
            }

            const updatedUser = await response.json();
            set((state) => ({
                user: {
                    ...state.user,
                    avatarUrl: updatedUser.avatarUrl,
                } as User,
                error: null,
            }));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update avatar';
            console.error(errorMessage);
            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },
}));
