'use client';

import { useEffect, useState } from 'react';
import { AddTask } from './addTask';
import { TaskItem } from './TaskItem';
import { useTaskStore } from '@/store/taskStore';
import { usePocketStore } from '@/store/pocketStore';
import { Button } from '@/components/ui/Button';

interface TaskListProps {
    pocketId: string;
    pocketName?: string;
    pocketEmoji?: string;
}

export function TaskList({ pocketId, pocketName = 'Home', pocketEmoji = '🏠' }: TaskListProps) {
    const { tasks, fetchTasks, isLoading, error } = useTaskStore();
    const { fetchAllPocketsWithTasks } = usePocketStore();
    const [showAll, setShowAll] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (pocketId) {
            fetchTasks(pocketId).catch((err) =>
                console.error('Error fetching tasks:', err)
            );
        }
    }, [pocketId, fetchTasks]);

    useEffect(() => {
        fetchAllPocketsWithTasks().catch((err) =>
            console.error('Error updating pocket task counts:', err)
        );
    }, [tasks, fetchAllPocketsWithTasks]);

    const completedTasks = tasks.filter((task) => task.isCompleted).length;
    const filteredTasks = tasks.filter((task) => showAll || !task.isCompleted);

    if (isLoading) {
        return <div className="text-center py-4">Loading tasks...</div>;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <div className="text-red-500 text-lg font-medium">
                    Oops! Failed to load tasks.
                </div>
                <p className="text-gray-500 mt-2">
                    {error || 'Something went wrong. Please try again.'}
                </p>
                <button
                    className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                    onClick={() => fetchTasks(pocketId)}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span>{pocketEmoji}</span>
                    {pocketName}
                </h2>
                <p className="text-gray-500">
                    {tasks.length > 0
                        ? `Remaining ${tasks.length - completedTasks} of ${tasks.length} tasks`
                        : 'No tasks available'}
                </p>
                <Button
                    variant="secondary"
                    onClick={() => setShowAll((prev) => !prev)}
                >
                    {showAll ? 'Show incomplete' : 'Show all'}
                </Button>
            </div>

            {/* Task List */}
            <div className="space-y-2">
                {filteredTasks.map((task) => (
                    <TaskItem
                        key={task._id}
                        task={task}
                        pocketId={pocketId}
                        onTaskUpdated={() => fetchAllPocketsWithTasks()}
                    />
                ))}
            </div>

            {/* Floating Add Task Button */}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-4 px-10 py-4 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 focus:outline-none"
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
                        <AddTask
                            pocketId={pocketId}
                            onTaskAdded={() => {
                                setIsModalOpen(false);
                                fetchTasks(pocketId);
                                fetchAllPocketsWithTasks(); // Odśwież liczbę zadań w kieszeniach
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
