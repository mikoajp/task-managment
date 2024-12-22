'use client';

import { useEffect, useState } from 'react';
import { AddTask } from './addTask';
import { TaskItem } from './TaskItem';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/Button';


interface TaskListProps {
    pocketId: string;
    pocketName?: string;
    pocketEmoji?: string;
}

export function TaskList({ pocketId, pocketName = 'Home', pocketEmoji = '🏠' }: TaskListProps) {
    const { tasks, fetchTasks, isLoading, error } = useTaskStore();
    const [showAll, setShowAll] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (pocketId) {
            fetchTasks(pocketId).catch((err) =>
                console.error('Error fetching tasks:', err)
            );
        }
    }, [pocketId, fetchTasks]);

    const filteredTasks = tasks.filter((task) => showAll || !task.isCompleted);

    if (isLoading) {
        return <div className="text-center py-4">Loading tasks...</div>;
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-4">
                Failed to load tasks: {error}
            </div>
        );
    }

    return (
        <div className="space-y-4 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    <span className="mr-2">{pocketEmoji}</span>
                    {pocketName}
                </h2>
                <p className="text-gray-500">
                    Remaining {tasks.filter((task) => !task.isCompleted).length} from {tasks.length} tasks.
                </p>
                <Button
                    variant="secondary"
                    onClick={() => setShowAll((prev) => !prev)}
                >
                    {showAll ? 'Show completed' : 'Show incomplete'}
                </Button>
            </div>

            {/* Task List */}
            <div className="space-y-2">
                {filteredTasks.map((task) => (
                    <TaskItem key={task._id} task={task} pocketId={pocketId} />
                ))}
            </div>

            {/* Floating Add Task Button */}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 focus:outline-none"
                >
                    <span className="text-sm font-medium">Create new task</span>
                    <span className="text-lg font-bold">⌘ N</span>
                </button>
            </div>

            {/* Add Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-800">Add Task</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                ✕
                            </button>
                        </div>
                        <AddTask pocketId={pocketId} />
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
