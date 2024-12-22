export interface CreateTaskDto {
    description: string;
    completed?: boolean;
}

export interface UpdateTaskDto {
    description?: string;
    isCompleted?: boolean;
}
export interface Task {
    _id: string;
    description: string;
    pocketId: string;
    completed: boolean; // Zgodnie z backendem
    isCompleted?: boolean; // Opcjonalna właściwość dla kompatybilności
}