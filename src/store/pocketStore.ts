import { create } from 'zustand';

interface Pocket {
    _id: string;
    name: string;
    emoji: string;
}

interface PocketStore {
    pockets: Pocket[];
    selectedPocketId: string | null;
    isLoading: boolean;
    error: string | null;
    fetchPockets: () => Promise<void>;
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
            console.log('Fetched pockets:', data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pockets';
            console.error('Error while fetching pockets:', errorMessage);

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

            const responseText = await response.text();
            console.log('Raw server response:', responseText);

            if (!response.ok) {
                const errorData = JSON.parse(responseText);
                console.error('Error from server:', errorData);
                throw new Error(errorData.message || 'Failed to create pocket');
            }

            const data = JSON.parse(responseText);
            console.log('Pocket created successfully:', data);
            return data;
        } catch (error) {
            console.error('Error while creating pocket:', error);
            throw error;
        }
    },


    deletePocket: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const isSuccessful = await fetch(`/api/pockets/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message || 'Failed to delete pocket');
                    });
                }
                return true;
            });

            if (isSuccessful) {
                set((state) => ({
                    pockets: state.pockets.filter((pocket) => pocket._id !== id),
                    selectedPocketId: state.selectedPocketId === id ? null : state.selectedPocketId,
                }));
                console.log(`Pocket with id ${id} deleted successfully.`);
            }

            return isSuccessful;
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