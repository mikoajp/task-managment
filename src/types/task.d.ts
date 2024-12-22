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
    completed: boolean;
    isCompleted?: boolean;
}