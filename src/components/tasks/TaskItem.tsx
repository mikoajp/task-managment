'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTaskStore } from '@/store/taskStore';

interface TaskItemProps {
    task: {
        _id: string;
        description: string;
        isCompleted: boolean;
    };
    pocketId: string;
}

export function TaskItem({ task, pocketId }: TaskItemProps) {
    const { updateTask, deleteTask, fetchTasks } = useTaskStore();
    const [showMenu, setShowMenu] = useState(false);

    const handleToggleComplete = async () => {
        try {
            await updateTask(pocketId, task._id, {
                isCompleted: !task.isCompleted,
            });
            await fetchTasks(pocketId);
        } catch (err) {
            console.error('Error toggling task completion:', err);
        }
    };

    return (
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-center gap-4 p-4 rounded-lg border ${
                    task.isCompleted ? 'bg-purple-100 border-purple-300' : 'bg-white border-gray-200'
                } hover:shadow-md transition-shadow`}
            >
                {/* Modern Checkbox */}
                <label className="relative flex items-center">
                    <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={handleToggleComplete}
                        className="sr-only peer" // Ukrycie domyślnego checkboxa
                    />
                    <div className="w-6 h-6 flex items-center justify-center border-2 rounded-lg border-gray-300 bg-white peer-checked:bg-purple-500 peer-checked:border-purple-500 transition-all">
                        {task.isCompleted && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-4 h-4 text-white"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        )}
                    </div>
                </label>

                {/* Task Description */}
                <span
                    className={`flex-1 ${
                        task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                >
                    {task.description}
                </span>

                {/* Three-Dot Menu */}
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                    <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                    </svg>
                </button>
            </motion.div>

            {/* Dropdown Menu */}
            {showMenu && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-md z-10 border border-gray-200"
                    onClick={() => setShowMenu(false)}
                >
                    <div className="py-1">
                        <button
                            onClick={handleToggleComplete}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            {task.isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                        </button>
                        <button
                            onClick={() => deleteTask(pocketId, task._id)}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                            Delete task
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
