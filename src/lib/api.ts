export const API_URL = 'https://recruitment-task.jakubcloud.pl';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error('API request failed');
    }

    return response.json();
};

export const api = {
    auth: {
        login: `${API_URL}/auth/login`,
        register: `${API_URL}/auth/register`,
        logout: `${API_URL}/auth/logout`,
    },
    pockets: {
        list: `${API_URL}/pockets`,
        create: `${API_URL}/pockets`,
        delete: (id: string) => `${API_URL}/pockets/${id}`,
    },
    tasks: {
        list: (pocketId: string) => `${API_URL}/pockets/${pocketId}/tasks`,
        create: (pocketId: string) => `${API_URL}/pockets/${pocketId}/tasks`,
        update: (pocketId: string, taskId: string) => `${API_URL}/pockets/${pocketId}/tasks/${taskId}`,
        delete: (pocketId: string, taskId: string) => `${API_URL}/pockets/${pocketId}/tasks/${taskId}`,
    }
};

export type ApiResponse<T> = {
    data: T;
    status: number;
    message?: string;
};