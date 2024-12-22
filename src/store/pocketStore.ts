import { create } from 'zustand';

interface Task {
    _id: string;
    description: string;
    completed: boolean;
    pocketId: string;
}

interface Pocket {
    _id: string;
    name: string;
    emoji: string;
    tasks?: Task[];
}

interface PocketStore {
    pockets: Pocket[];
    selectedPocketId: string | null;
    isLoading: boolean;
    error: string | null;
    fetchPockets: () => Promise<void>;
    fetchAllPocketsWithTasks: () => Promise<void>;
    createPocket: (name: string, emoji: string) => Promise<boolean>;
    deletePocket: (id: string) => Promise<boolean>;
    selectPocket: (id: string) => void;
}

export const usePocketStore = create<PocketStore>((set) => ({
    pockets: [],
    selectedPocketId: null,
    isLoading: false,
    error: null,

    fetchPockets: async () => {
        set({ isLoading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('/api/pockets', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch pockets');
            }

            const data = await response.json();
            set({ pockets: data });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pockets';
            console.error('Error while fetching pockets:', errorMessage);

            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAllPocketsWithTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const pocketsResponse = await fetch('/api/pockets', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!pocketsResponse.ok) {
                const errorData = await pocketsResponse.json();
                throw new Error(errorData.message || 'Failed to fetch pockets');
            }

            const pockets: Pocket[] = await pocketsResponse.json();

            const tasksPromises = pockets.map(async (pocket) => {
                const tasksResponse = await fetch(`/api/pockets/${pocket._id}/tasks`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (tasksResponse.ok) {
                    const tasks: Task[] = await tasksResponse.json();
                    return { ...pocket, tasks };
                }

                return pocket;
            });

            const pocketsWithTasks = await Promise.all(tasksPromises);

            set({ pockets: pocketsWithTasks });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pockets with tasks';
            console.error('Error while fetching pockets with tasks:', errorMessage);

            set({ error: errorMessage });
        } finally {
            set({ isLoading: false });
        }
    },

    createPocket: async (name: string, emoji: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('/api/pockets', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, emoji }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create pocket');
            }

            const newPocket = await response.json();

            set((state) => ({ pockets: [...state.pockets, newPocket] }));
            return true;
        } catch (error) {
            console.error('Error while creating pocket:', error);
            set({ error: error instanceof Error ? error.message : 'Failed to create pocket' });
            return false;
        }
    },

    deletePocket: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`/api/pockets/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete pocket');
            }

            set((state) => ({
                pockets: state.pockets.filter((pocket) => pocket._id !== id),
                selectedPocketId: state.selectedPocketId === id ? null : state.selectedPocketId,
            }));
            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete pocket';
            console.error('Error while deleting pocket:', errorMessage);

            set({ error: errorMessage });
            return false;
        } finally {
            set({ isLoading: false });
        }
    },

    selectPocket: (id: string) => {
        set({ selectedPocketId: id });
    },
}));
