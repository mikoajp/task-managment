import { create } from 'zustand';
import { CreateTaskDto, UpdateTaskDto } from "@/types/task";

interface Task {
    _id: string;
    title: string;
    completed: boolean;
    description: string;
    pocketId: string;
}

interface Pocket {
    _id: string;
    name: string;
    emoji: string;
}

interface TaskStore {
    tasks: Task[];
    pockets: Pocket[];
    isLoading: boolean;
    error: string | null;

    fetchAllPocketsWithTasks: () => Promise<void>;
    fetchTasks: (pocketId: string) => Promise<void>;
    createTask: (pocketId: string, data: CreateTaskDto) => Promise<void>;
    updateTask: (pocketId: string, taskId: string, updates: UpdateTaskDto) => Promise<void>;
    deleteTask: (pocketId: string, taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    pockets: [],
    isLoading: false,
    error: null,

    fetchAllPocketsWithTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const pocketsResponse = await fetch(`/api/pockets`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!pocketsResponse.ok) {
                const errorData = await pocketsResponse.json();
                throw new Error(errorData.message || 'Failed to fetch pockets');
            }

            const pockets = await pocketsResponse.json();

            // Fetch tasks for each pocket
            const tasks = [];
            for (const pocket of pockets) {
                const tasksResponse = await fetch(`/api/pockets/${pocket._id}/tasks`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (tasksResponse.ok) {
                    const pocketTasks = await tasksResponse.json();
                    tasks.push(...pocketTasks);
                }
            }

            set({ pockets, tasks, error: null });
        } catch (err) {
            console.error('Error fetching pockets and tasks:', err);
            set({ error: err instanceof Error ? err.message : 'Failed to fetch data' });
        } finally {
            set({ isLoading: false });
        }
    },
    fetchTasks: async (pocketId: string) => {
        if (!pocketId) {
            throw new Error('Pocket ID is required to fetch tasks');
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const url = `/api/pockets/${pocketId}/tasks`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch tasks');
            }

            const data = await response.json();

            // Mapowanie `_id` na `id`
            const tasks = data.map((task: Task) => ({
                ...task,
                id: task._id,
            }));

            set({ tasks, error: null });
        } catch (err) {
            console.error('Error fetching tasks:', err);
            set({ error: err instanceof Error ? err.message : 'Failed to fetch tasks' });
        } finally {
            set({ isLoading: false });
        }
    },

    createTask: async (pocketId: string, data: CreateTaskDto) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`/api/pockets/${pocketId}/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: data.description,
                    completed: data.completed || false
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add task');
            }

            const newTask = await response.json();
            set((state) => ({
                tasks: [...state.tasks, newTask],
                error: null
            }));

            return newTask;
        } catch (err) {
            console.error('Error adding task:', err);
            set({ error: err instanceof Error ? err.message : 'Failed to add task' });
            throw err;
        }
    },

    updateTask: async (pocketId: string, taskId: string, updates: UpdateTaskDto) => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`/api/pockets/${pocketId}/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            const updatedTask = await response.json();
            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task._id === taskId
                        ? {
                            ...task,
                            description: updatedTask.description,
                            completed: updatedTask.completed
                        }
                        : task
                ),
                error: null,
            }));
        } catch (err) {
            set({ error: err instanceof Error ? err.message : 'Failed to update task' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },
    deleteTask: async (pocketId: string, taskId: string) => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`/api/pockets/${pocketId}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete task');
            }

            set(state => ({
                tasks: state.tasks.filter(task => task._id !== taskId),
                error: null
            }));

        } catch (err) {
            console.error('Error deleting task:', err);
            set({ error: err instanceof Error ? err.message : 'Failed to delete task' });
        } finally {
            set({ isLoading: false });
        }
    }
}));